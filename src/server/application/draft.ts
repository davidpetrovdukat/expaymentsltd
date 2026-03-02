import { SupabaseClient } from '@supabase/supabase-js';

/**
 * Ensures the request is authenticated and returns the user ID.
 * Throws if unauthenticated.
 */
export async function getUserOrThrow(supabase: SupabaseClient) {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) {
        throw new Error('Unauthorized');
    }
    return user.id;
}

export interface ApplicationDraftRow {
    id: string;
    user_id: string;
    status: 'DRAFT' | 'PENDING' | 'SIGNED';
    current_step: number;
    progress_percent: number;
    form_data: Record<string, unknown>;
    submitted_at: string | null;
    created_at: string;
    updated_at: string;
}

/**
 * Returns a specific application by its PK, scoped to the given userId (RLS-safe).
 */
export async function getApplicationById(
    supabase: SupabaseClient,
    applicationId: string,
    userId: string
): Promise<ApplicationDraftRow | null> {
    const { data, error } = await supabase
        .from('merchant_applications')
        .select('*')
        .eq('id', applicationId)
        .eq('user_id', userId)
        .maybeSingle();

    if (error) {
        console.error('getApplicationById error:', error);
        throw error;
    }

    return data;
}

/**
 * Returns the most-recent DRAFT application row for the user, or null if none exists.
 * Used as a fallback when no applicationId is known.
 */
export async function getApplicationRow(supabase: SupabaseClient, userId: string): Promise<ApplicationDraftRow | null> {
    const { data, error } = await supabase
        .from('merchant_applications')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'DRAFT')
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();

    if (error) {
        console.error('getApplicationRow error:', error);
        throw error;
    }

    return data;
}

/**
 * Returns all merchant_applications rows for the current authenticated user.
 */
export async function getUserApplications(): Promise<{ applications: ApplicationDraftRow[] }> {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { createClient } = require('@/lib/supabase/server');
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return { applications: [] };
    }

    const { data, error } = await supabase
        .from('merchant_applications')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

    if (error) {
        console.error('getUserApplications error:', error);
        return { applications: [] };
    }

    return { applications: data || [] };
}

/**
 * Lazily creates a new merchant_application row in DRAFT state.
 */
export async function createApplicationRow(supabase: SupabaseClient, userId: string): Promise<ApplicationDraftRow> {
    const { data, error } = await supabase
        .from('merchant_applications')
        .insert({
            user_id: userId,
            status: 'DRAFT',
            current_step: 1,
            progress_percent: 0,
            form_data: {}
        })
        .select('*')
        .single();

    if (error) {
        console.error('createApplicationRow error:', error);
        throw error;
    }

    return data;
}

/**
 * Strips bare nested step objects from form_data, keeping only flat dotted keys.
 */
function normalizeServerFormData(data: Record<string, unknown>): Record<string, unknown> {
    const clean: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(data)) {
        if (/^step\d+$/.test(key) && value && typeof value === 'object' && !Array.isArray(value)) {
            for (const [nestedKey, nestedValue] of Object.entries(value as Record<string, unknown>)) {
                const flatKey = `${key}.${nestedKey}`;
                if (!(flatKey in clean) || clean[flatKey] === '' || clean[flatKey] === undefined) {
                    clean[flatKey] = nestedValue;
                }
            }
            continue;
        }
        clean[key] = value;
    }

    return clean;
}

/** Safely extract a human-readable error string from any thrown value. */
function safeErrorMessage(e: unknown): string {
    if (e instanceof Error) return e.message;
    if (e && typeof e === 'object') {
        const obj = e as Record<string, unknown>;
        if (typeof obj.message === 'string') return obj.message;
        try { return JSON.stringify(e); } catch { /* fall through */ }
    }
    return String(e);
}

/**
 * Deep-merges the patch into the existing form_data, applying toggle reset rules.
 * Scoped to a specific application row by `id` when provided.
 */
export async function upsertDraftPatch(
    supabase: SupabaseClient,
    userId: string,
    patch: Record<string, unknown>,
    currentStep: number,
    progressPercent: number,
    applicationId?: string
): Promise<{ ok: boolean; id?: string; updated_at?: string; error?: string }> {
    try {
        // 1. Resolve the target row
        let row: ApplicationDraftRow | null = null;

        if (applicationId) {
            row = await getApplicationById(supabase, applicationId, userId);
        } else {
            row = await getApplicationRow(supabase, userId);
        }

        if (!row) {
            row = await createApplicationRow(supabase, userId);
            if (process.env.NODE_ENV === 'development') {
                console.log('[draft] Created new row:', row.id.slice(0, 8), 'for user:', userId.slice(0, 8));
            }
        }

        // 2. Prevent updating if already submitted
        if (row.status !== 'DRAFT') {
            return { ok: false, error: 'Application is no longer in DRAFT status.' };
        }

        // 3. Normalize existing form_data
        const normalizedExisting = normalizeServerFormData(row.form_data);

        // 4. Merge patch
        const mergedFormData = { ...normalizedExisting, ...patch };

        // 5. Apply toggle reset rules
        const cleanFormData = applyToggleResets(mergedFormData);

        // 6. Final normalization
        const finalFormData = normalizeServerFormData(cleanFormData);

        // 7. Only push current_step / progress forward
        const actualCurrentStep = Math.max(row.current_step, currentStep);
        const actualProgress = Math.max(row.progress_percent, progressPercent);

        // 8. Push to DB — scoped by row id, not user_id
        const { data: updatedRow, error } = await supabase
            .from('merchant_applications')
            .update({
                form_data: finalFormData,
                current_step: actualCurrentStep,
                progress_percent: actualProgress,
                updated_at: new Date().toISOString()
            })
            .eq('id', row.id)
            .eq('status', 'DRAFT')
            .select('id, updated_at')
            .maybeSingle();

        if (error) {
            console.error('upsertDraftPatch update error:', error);
            return { ok: false, error: safeErrorMessage(error) };
        }

        if (!updatedRow) {
            return { ok: false, error: 'Application status changed during save. Please refresh.' };
        }

        if (process.env.NODE_ENV === 'development') {
            console.log('[draft] Saved step', currentStep, 'app:', row.id.slice(0, 8), '| keys:', Object.keys(finalFormData).length);
        }

        return { ok: true, id: updatedRow.id, updated_at: updatedRow.updated_at };

    } catch (e: unknown) {
        console.error('upsertDraftPatch exception:', e);
        return { ok: false, error: safeErrorMessage(e) };
    }
}

/**
 * Enforces data contract rules by resetting visually hidden or logically disabled fields.
 */
export function applyToggleResets(data: Record<string, unknown>): Record<string, unknown> {
    const clean = { ...data };

    if (clean['step2.is_licensed'] === false) {
        clean['step2.license_number'] = '';
        clean['step2.license_issue_date'] = '';
    }

    if (clean['step2.has_subscription'] === false) {
        clean['step2.subscription_terms_url'] = '';
    }

    if (clean['step2.has_country_restrictions'] === false) {
        clean['step2.restricted_countries'] = [];
    }

    if (clean['step2.has_own_stock'] === false) {
        clean['step2.stock_locations'] = [];
    }

    if (clean['step2.has_customer_identification'] === false) {
        clean['step2.identification_details'] = '';
    }

    if (clean['step2.has_cancellation_policy'] === false) {
        clean['step2.cancellation_policy'] = '';
    }

    if (Array.isArray(clean['step4.persons'])) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        clean['step4.persons'] = clean['step4.persons'].map((person: any) => {
            const p = { ...person };

            if (p.is_pep === false) {
                p.pep_roles = [];
            }

            if (p.is_shareholder === false) {
                p.shareholder_percent = '';
            }

            if (p.is_ubo === false) {
                p.ubo_share_percent = '';
                p.ubo_ownership_type = '';
                p.ubo_tax_residence = '';
                p.ubo_tax_id = '';
                p.ubo_fund_sources = [];
            }

            return p;
        });
    }

    return clean;
}
