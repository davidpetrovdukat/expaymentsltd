'use server';

import { createClient } from '@/lib/supabase/server';
import { getUserOrThrow, getApplicationRow } from '@/server/application/draft';
import { generateApplicationPdf, buildPdfFilename } from '@/server/pdf/application-pdf';
import { Resend } from 'resend';
import { serverEnv } from '@/lib/env/server';

export interface Step5Fields {
    title: string;
    first_name: string;
    last_name: string;
}

export interface SubmitResult {
    ok: boolean;
    error?: string;
    applicationId?: string;
}

/**
 * Finalises the merchant application:
 * 1. Server-side validate step5 required fields.
 * 2. Read full form_data from DB (autosaved by previous steps).
 * 3. Merge step5 fields in and flip status DRAFT → PENDING atomically
 *    (WHERE status = 'DRAFT' guard prevents double-submit).
 * 4. Generate PDF from the submitted form_data.
 * 5. Send compliance email via Resend with PDF attached.
 */
export async function submitApplicationAction(step5: Step5Fields): Promise<SubmitResult> {
    // ── 1. Validate step5 fields ──────────────────────────────────────────────
    const missing: string[] = [];
    if (!step5.title?.trim()) missing.push('Title');
    if (!step5.first_name?.trim()) missing.push('First Name');
    if (!step5.last_name?.trim()) missing.push('Last Name');
    if (missing.length > 0) {
        return { ok: false, error: `Please fill in: ${missing.join(', ')}.` };
    }

    // ── 2. Get authenticated user ─────────────────────────────────────────────
    const supabase = await createClient();
    let userId: string;
    try {
        userId = await getUserOrThrow(supabase);
    } catch {
        return { ok: false, error: 'Unauthorized. Please log in and try again.' };
    }

    // ── 3. Read current draft row ─────────────────────────────────────────────
    const row = await getApplicationRow(supabase, userId);
    if (!row) {
        return { ok: false, error: 'Application not found. Please start the application form.' };
    }
    if (row.status !== 'DRAFT') {
        // Already submitted — idempotent: treat as success so user reaches /success
        return { ok: true, applicationId: row.id };
    }

    // ── 4. Validate required fields from all steps before submit ──────────────
    const fd = row.form_data as Record<string, unknown>;
    const validationErrors = validateAllSteps(fd);
    if (validationErrors.length > 0) {
        return { ok: false, error: `Missing or invalid fields: ${validationErrors.join('; ')}` };
    }

    // ── 5. Merge step5 patch + flip to PENDING (single atomic UPDATE) ─────────
    const submittedAt = new Date().toISOString();
    const mergedFormData: Record<string, unknown> = {
        ...fd,
        'step5.title': step5.title.trim(),
        'step5.first_name': step5.first_name.trim(),
        'step5.last_name': step5.last_name.trim(),
    };

    const { data: updatedRow, error: updateError } = await supabase
        .from('merchant_applications')
        .update({
            form_data: mergedFormData,
            status: 'PENDING',
            current_step: 5,
            progress_percent: 100,
            submitted_at: submittedAt,
        })
        .eq('user_id', userId)
        .eq('status', 'DRAFT')   // idempotency guard — no-op if already PENDING
        .select('id')
        .single();

    if (updateError || !updatedRow) {
        console.error('[submit] DB update error:', updateError?.message);
        return {
            ok: false,
            error: 'Application could not be submitted. It may already have been submitted.',
        };
    }

    console.log('[submit] Application PENDING:', updatedRow.id, 'user:', userId.slice(0, 8));

    // ── 5. Generate PDF (fire-and-forget; errors logged, not surfaced to user) ─
    try {
        const pdfBuffer = await generateApplicationPdf(mergedFormData, submittedAt);
        const filename = buildPdfFilename(mergedFormData, submittedAt);

        await sendComplianceEmail(mergedFormData, pdfBuffer, filename, submittedAt);
        console.log('[submit] Email sent:', filename);
    } catch (pdfOrEmailErr) {
        // Application is already PENDING — do not fail the user flow.
        console.error('[submit] PDF/email pipeline error:', pdfOrEmailErr);
    }

    return { ok: true, applicationId: updatedRow.id };
}

// ─── Validation ──────────────────────────────────────────────────────────────

const STEP1_REQUIRED = [
    'step1.company_name', 'step1.company_number', 'step1.incorporation_country',
    'step1.incorporation_date', 'step1.corporate_phone', 'step1.corporate_email',
    'step1.street', 'step1.city', 'step1.post_code',
    'step1.contact_first_name', 'step1.contact_surname',
    'step1.contact_telephone', 'step1.contact_email',
];

const COMMON_PERSON_REQUIRED = [
    'first_name', 'last_name', 'living_address', 'city', 'telephone', 'email',
];

const PERSON_TYPE_REQUIRED = [
    'dob', 'citizenship', 'passport_number',
    'issue_date', 'expiry_date', 'issuing_country', 'residence_country',
];

const COMPANY_TYPE_REQUIRED = [
    'company_name', 'company_reg_number', 'company_jurisdiction',
];

function validateAllSteps(fd: Record<string, unknown>): string[] {
    const errs: string[] = [];
    const blank = (v: unknown) => !v || (typeof v === 'string' && !v.trim());

    for (const key of STEP1_REQUIRED) {
        if (blank(fd[key])) {
            errs.push(`Step 1: ${key.replace('step1.', '')} is required`);
        }
    }

    const persons = fd['step4.persons'] as Record<string, unknown>[] | undefined;
    if (!Array.isArray(persons) || persons.length === 0) {
        errs.push('Step 4: At least one person is required');
    } else {
        for (let i = 0; i < persons.length; i++) {
            const p = persons[i];
            const isCompany = String(p.type) === 'Company';
            const label = isCompany ? `Step 4 Company ${i + 1}` : `Step 4 Person ${i + 1}`;

            for (const field of COMMON_PERSON_REQUIRED) {
                if (blank(p[field])) errs.push(`${label}: ${field} is required`);
            }

            if (isCompany) {
                for (const field of COMPANY_TYPE_REQUIRED) {
                    if (blank(p[field])) errs.push(`${label}: ${field} is required`);
                }
            } else {
                for (const field of PERSON_TYPE_REQUIRED) {
                    if (blank(p[field])) errs.push(`${label}: ${field} is required`);
                }
                const issue = p.issue_date as string;
                const expiry = p.expiry_date as string;
                if (issue && expiry && expiry <= issue) {
                    errs.push(`${label}: expiry_date must be after issue_date`);
                }
            }
        }
    }

    return errs;
}

// ─── Private helpers ─────────────────────────────────────────────────────────

async function sendComplianceEmail(
    formData: Record<string, unknown>,
    pdfBuffer: Buffer,
    filename: string,
    submittedAt: string
): Promise<void> {
    const apiKey = serverEnv.RESEND_API_KEY;
    if (!apiKey) {
        console.warn('[submit] RESEND_API_KEY not set — skipping email.');
        return;
    }

    const resend = new Resend(apiKey);
    const companyName = String(formData['step1.company_name'] || 'Unknown');
    const submitDate = new Date(submittedAt).toLocaleDateString('en-GB', {
        day: '2-digit', month: 'long', year: 'numeric'
    });

    const { error } = await resend.emails.send({
        from: 'onboarding@ex-payments.com',
        to: serverEnv.COMPLIANCE_EMAIL_TO ?? 'compliance@ex-payments.com',
        subject: `New Merchant Application: ${companyName} — ${submitDate}`,
        html: `
            <p>A new merchant application has been submitted.</p>
            <ul>
                <li><strong>Company:</strong> ${companyName}</li>
                <li><strong>Submitted:</strong> ${submitDate}</li>
                <li><strong>Signatory:</strong> ${formData['step5.title'] ?? ''} ${formData['step5.first_name'] ?? ''} ${formData['step5.last_name'] ?? ''}</li>
            </ul>
            <p>The full application PDF is attached to this email.</p>
        `,
        attachments: [
            {
                filename,
                content: pdfBuffer,
            },
        ],
    });

    if (error) {
        throw new Error(`Resend error: ${JSON.stringify(error)}`);
    }
}
