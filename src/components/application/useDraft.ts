import { useEffect, useState, useCallback, useRef } from 'react';

interface DraftState {
    isLoading: boolean;
    isSaving: boolean;
    lastSavedAt: string | null;
    error: string | null;
}

/**
 * Recursively flattens a nested object into flat dotted keys.
 * RHF watch() returns { step1: { company_name: "X" } } but the
 * server expects { "step1.company_name": "X" }.
 *
 * Handles arrays by keeping them as values (not flattening further).
 */
export function flattenToDottedKeys(
    obj: Record<string, unknown>,
    prefix = ''
): Record<string, unknown> {
    const result: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(obj)) {
        const fullKey = prefix ? `${prefix}.${key}` : key;

        if (value !== null && value !== undefined && typeof value === 'object' && !Array.isArray(value)) {
            Object.assign(result, flattenToDottedKeys(value as Record<string, unknown>, fullKey));
        } else {
            result[fullKey] = value;
        }
    }

    return result;
}

/**
 * Flattens any nested step objects in form_data into flat dotted keys.
 */
function normalizeFormData(raw: Record<string, unknown>): Record<string, unknown> {
    const result: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(raw)) {
        if (/^step\d+$/.test(key) && value && typeof value === 'object' && !Array.isArray(value)) {
            for (const [nestedKey, nestedValue] of Object.entries(value as Record<string, unknown>)) {
                const flatKey = `${key}.${nestedKey}`;
                result[flatKey] = nestedValue;
            }
        } else {
            if (!(key in result) || result[key] === '' || result[key] === undefined) {
                result[key] = value;
            }
        }
    }

    return result;
}

// ─── sessionStorage helpers (safe for SSR) ──────────────────────────────────

const APP_ID_KEY = 'applicationId';

function getStoredAppId(): string | null {
    if (typeof window === 'undefined') return null;
    try { return sessionStorage.getItem(APP_ID_KEY); } catch { return null; }
}

function setStoredAppId(id: string): void {
    if (typeof window === 'undefined') return;
    try { sessionStorage.setItem(APP_ID_KEY, id); } catch { /* quota / private mode */ }
}

/**
 * Custom hook to manage fetching and debounced autosaving of draft data.
 * Tracks applicationId via sessionStorage for deterministic multi-app support.
 * Exposes `status` to allow step pages to skip validation / block autosave for non-DRAFT apps.
 */
export function useDraft(currentStep: number) {
    const [state, setState] = useState<DraftState>({
        isLoading: true,
        isSaving: false,
        lastSavedAt: null,
        error: null,
    });

    const [initialData, setInitialData] = useState<Record<string, unknown>>({});
    const [applicationId, setApplicationId] = useState<string | null>(null);
    const [status, setStatus] = useState<string | null>(null);

    const isHydratedRef = useRef(false);
    const [isHydrated, setIsHydrated] = useState(false);

    const saveTimeoutRef = useRef<NodeJS.Timeout>(null);
    const appIdRef = useRef<string | null>(null);
    const statusRef = useRef<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        async function fetchDraft() {
            try {
                const storedId = getStoredAppId();
                const url = storedId
                    ? `/api/application/draft?applicationId=${encodeURIComponent(storedId)}`
                    : '/api/application/draft';

                const res = await fetch(url, { cache: 'no-store' });
                if (!res.ok) {
                    const body = await res.json().catch(() => ({ error: res.statusText }));
                    throw new Error(body.error || `Failed to fetch draft (${res.status})`);
                }

                const data = await res.json();

                if (isMounted) {
                    if (data && data.form_data) {
                        const normalized = normalizeFormData(data.form_data);
                        setInitialData(normalized);
                        setState(s => ({ ...s, lastSavedAt: data.updated_at, isLoading: false }));

                        const id = data.id as string;
                        setApplicationId(id);
                        appIdRef.current = id;
                        setStoredAppId(id);

                        if (data.status) {
                            statusRef.current = data.status;
                            setStatus(data.status);
                        }
                    } else {
                        setState(s => ({ ...s, isLoading: false }));
                    }
                    isHydratedRef.current = true;
                    setIsHydrated(true);
                }
            } catch (err: unknown) {
                if (isMounted) {
                    const msg = err instanceof Error ? err.message : String(err);
                    setState(s => ({ ...s, error: msg, isLoading: false }));
                    isHydratedRef.current = true;
                    setIsHydrated(true);
                }
            }
        }

        fetchDraft();
        return () => { isMounted = false; };
    }, []);

    const performSave = useCallback(async (patch: Record<string, unknown>, progressPercent: number) => {
        if (!isHydratedRef.current) return;
        if (statusRef.current && statusRef.current !== 'DRAFT') return;

        setState(s => ({ ...s, isSaving: true, error: null }));
        try {
            const res = await fetch('/api/application/draft', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    patch,
                    currentStep,
                    progressPercent,
                    applicationId: appIdRef.current ?? undefined,
                })
            });

            if (!res.ok) {
                const body = await res.json().catch(() => ({ error: res.statusText }));
                const errorMsg = typeof body.error === 'string' ? body.error : JSON.stringify(body);

                if (process.env.NODE_ENV === 'development') {
                    console.error('[useDraft] save failed:', { status: res.status, error: errorMsg, patchKeys: Object.keys(patch).slice(0, 10) });
                }

                setState(s => ({ ...s, isSaving: false, error: errorMsg }));
                return;
            }

            const data = await res.json();

            if (data.id && !appIdRef.current) {
                appIdRef.current = data.id;
                setApplicationId(data.id);
                setStoredAppId(data.id);
            }

            setState(s => ({
                ...s,
                isSaving: false,
                lastSavedAt: data.updated_at || new Date().toISOString()
            }));
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : String(err);
            console.error('[useDraft] save exception:', msg);
            setState(s => ({ ...s, isSaving: false, error: msg }));
        }
    }, [currentStep]);

    const autoSave = useCallback((patch: Record<string, unknown>, progressPercent: number) => {
        if (!isHydratedRef.current) return;

        if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current);
        }

        setState(s => ({ ...s, isSaving: true, error: null }));

        saveTimeoutRef.current = setTimeout(() => {
            performSave(patch, progressPercent);
        }, 1000);
    }, [performSave]);

    const saveDraft = useCallback((patch: Record<string, unknown>, progressPercent: number) => {
        if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current);
        }
        performSave(patch, progressPercent);
    }, [performSave]);

    return {
        ...state,
        initialData,
        isHydrated,
        applicationId,
        status,
        autoSave,
        saveDraft
    };
}
