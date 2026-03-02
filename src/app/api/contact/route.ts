import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { Resend } from 'resend';
import { serverEnv } from '@/lib/env/server';

// ─── In-memory rate limiter (ephemeral, resets on server restart) ─────────────
const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW_MS = 60_000;

const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): { allowed: boolean; retryAfterMs: number } {
    const now = Date.now();
    const entry = rateLimitStore.get(ip);

    if (!entry || now > entry.resetAt) {
        rateLimitStore.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
        return { allowed: true, retryAfterMs: 0 };
    }
    if (entry.count >= RATE_LIMIT_MAX) {
        return { allowed: false, retryAfterMs: entry.resetAt - now };
    }
    entry.count += 1;
    return { allowed: true, retryAfterMs: 0 };
}

// ─── Validation schema ─────────────────────────────────────────────────────────
const ContactSchema = z.object({
    name: z.string().min(1, 'Name is required').max(100),
    email: z.string().email('Invalid email address'),
    subject: z.enum(['technical', 'sales', 'billing', 'other']).refine(
        (v) => ['technical', 'sales', 'billing', 'other'].includes(v),
        { message: 'Please select a subject' }
    ),
    message: z.string().min(10, 'Message must be at least 10 characters').max(5000),
    // Honeypot — must be empty; bots fill it, humans leave it blank
    website: z.string().max(0, 'Spam detected'),
});

const SUBJECT_LABELS: Record<string, string> = {
    technical: 'Technical Support',
    sales: 'Sales Inquiry',
    billing: 'Billing Question',
    other: 'Other',
};

// ─── Route handler ─────────────────────────────────────────────────────────────
export async function POST(req: NextRequest): Promise<NextResponse> {
    // Derive client IP from headers (works behind Vercel/reverse proxies)
    const ip =
        req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
        req.headers.get('x-real-ip') ??
        'unknown';

    const { allowed, retryAfterMs } = checkRateLimit(ip);
    if (!allowed) {
        return NextResponse.json(
            { error: 'Too many requests. Please wait a moment before trying again.' },
            {
                status: 429,
                headers: { 'Retry-After': String(Math.ceil(retryAfterMs / 1000)) },
            }
        );
    }

    let body: unknown;
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
    }

    const parsed = ContactSchema.safeParse(body);
    if (!parsed.success) {
        return NextResponse.json(
            { error: 'Validation failed', issues: parsed.error.issues },
            { status: 400 }
        );
    }

    const { name, email, subject, message } = parsed.data;

    const apiKey = serverEnv.RESEND_API_KEY;
    if (!apiKey) {
        console.warn('[contact] RESEND_API_KEY not set — skipping email.');
        return NextResponse.json({ ok: true, dev: 'Email skipped (no API key)' });
    }

    const resend = new Resend(apiKey);
    const subjectLabel = SUBJECT_LABELS[subject] ?? subject;

    const { error } = await resend.emails.send({
        from: 'onboarding@ex-payments.com',
        to: 'info@ex-payments.com',
        replyTo: email,
        subject: `Contact Form: ${subjectLabel} — ${name}`,
        html: `
            <p><strong>From:</strong> ${name} &lt;${email}&gt;</p>
            <p><strong>Subject:</strong> ${subjectLabel}</p>
            <hr />
            <p style="white-space:pre-wrap">${message.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
        `,
    });

    if (error) {
        console.error('[contact] Resend error:', error);
        return NextResponse.json(
            { error: 'Failed to send message. Please try again or email us directly.' },
            { status: 502 }
        );
    }

    return NextResponse.json({ ok: true });
}
