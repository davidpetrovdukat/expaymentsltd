'use client';

import { Suspense, useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'next/navigation';
import { StepProgress } from '@/components/application/StepProgress';
import { StepActions } from '@/components/application/StepActions';
import { Gavel, AlertTriangle, ChevronRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useDraft, flattenToDottedKeys } from '@/components/application/useDraft';
import { submitApplicationAction } from '@/server/actions/submit-application';
import { useRouter } from 'next/navigation';

interface Step5FormData {
    'step5.title': string;
    'step5.first_name': string;
    'step5.last_name': string;
}

function Step5Content() {
    const currentStep = 5;
    const progressPercent = 80;
    const searchParams = useSearchParams();
    const viewMode = searchParams.get('mode') === 'view';
    const applicationId = searchParams.get('applicationId');
    const viewQuery = applicationId ? `?mode=view&applicationId=${applicationId}` : '';

    const today = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    const { initialData, isLoading, isSaving, lastSavedAt, error, autoSave, saveDraft, isHydrated } = useDraft(currentStep);
    const [isRestored, setIsRestored] = useState(false);
    const skipNextSaveRef = useRef(false);

    const { register, watch, reset } = useForm<Step5FormData>({
        defaultValues: {
            'step5.title': '',
            'step5.first_name': '',
            'step5.last_name': '',
        }
    });

    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    // Restore draft values on load
    useEffect(() => {
        if (isLoading) return;
        const step5Data = Object.keys(initialData)
            .filter(key => key.startsWith('step5.'))
            .reduce((acc, key) => {
                acc[key as keyof Step5FormData] = initialData[key] as never;
                return acc;
            }, {} as Partial<Step5FormData>);
        skipNextSaveRef.current = true;
        reset(step5Data);
        setIsRestored(true);
    }, [isLoading, initialData, reset]);

    // Autosave listener — GATED on isHydrated to prevent sending empty defaults
    useEffect(() => {
        if (!isRestored || !isHydrated) return;
        const subscription = watch((value) => {
            if (skipNextSaveRef.current) {
                skipNextSaveRef.current = false;
                return;
            }
            const flatPatch = flattenToDottedKeys(value as unknown as Record<string, unknown>);
            autoSave(flatPatch, progressPercent);
        });
        return () => subscription.unsubscribe();
    }, [watch, autoSave, progressPercent, isRestored, isHydrated]);

    async function handleSignAndFinish() {
        setSubmitError(null);
        const values = watch();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const step5 = (values as any)?.step5 ?? {};
        const title = (step5.title as string)?.trim() ?? '';
        const firstName = (step5.first_name as string)?.trim() ?? '';
        const lastName = (step5.last_name as string)?.trim() ?? '';

        if (!title || !firstName || !lastName) {
            setSubmitError('Please fill in all signature fields (Title, First Name, Surname) before submitting.');
            return;
        }

        setIsSubmitting(true);
        try {
            const flatPatch = flattenToDottedKeys(values as unknown as Record<string, unknown>);
            saveDraft(flatPatch, progressPercent);

            const result = await submitApplicationAction({ title, first_name: firstName, last_name: lastName });
            if (result.ok) {
                router.push('/application/success');
            } else {
                setSubmitError(result.error ?? 'Submission failed. Please try again.');
            }
        } catch (err) {
            console.error('[step5] submit error:', err);
            setSubmitError('An unexpected error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    }

    if (isLoading || !isRestored) {
        return (
            <div className="flex flex-col items-center justify-center py-20 min-h-[50vh]">
                <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
                <p className="text-slate-500 font-medium animate-pulse">Loading application draft...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 text-red-600 p-6 rounded-xl border border-red-200 mt-10 text-center max-w-2xl mx-auto">
                <h3 className="font-bold mb-2 text-lg">Failed to load application</h3>
                <p className="text-sm opacity-90">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-4 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 font-semibold rounded-lg transition-colors"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={(e) => e.preventDefault()}>
            <fieldset disabled={viewMode} className="border-0 p-0 m-0 min-w-0">
            {/* Breadcrumb / Header */}
            <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                    <nav className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-500">
                        <Link className="hover:text-primary transition-colors" href="/application/step-1">
                            Merchant Application
                        </Link>
                        <ChevronRight className="h-4 w-4" />
                        <span className="text-text-main">Declaration</span>
                    </nav>
                    <h1 className="text-3xl font-black tracking-tight text-text-main">
                        Step 5: Declaration
                    </h1>
                    <p className="mt-2 text-text-secondary max-w-2xl">
                        Please review the legal declaration and sign electronically to complete your merchant application.
                    </p>
                </div>
                {/* Draft Status Indicator */}
                <div className="flex flex-col items-end text-sm">
                    {isSaving ? (
                        <span className="text-amber-500 font-medium flex items-center gap-1.5 animate-pulse">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                            Saving...
                        </span>
                    ) : lastSavedAt ? (
                        <span className="text-emerald-500 font-medium flex items-center gap-1.5 opacity-80">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            Draft saved
                        </span>
                    ) : null}
                </div>
            </div>

            <StepProgress currentStep={5} />

            {/* Card Container */}
            <div className="relative overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-slate-900/5">
                {/* Card Body */}
                <div className="p-6 sm:p-8 md:p-10">
                    {/* Legal Text Section */}
                    <div className="mb-10">
                        <div className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-400">
                            <Gavel className="h-4 w-4" />
                            Legal Agreement
                        </div>
                        <div className="h-[320px] overflow-y-auto rounded-xl border border-slate-200 bg-slate-50 p-6 text-sm leading-relaxed text-slate-600 scrollbar-thin scrollbar-thumb-slate-300">
                            <p className="font-medium text-text-main mb-4">
                                By submitting the present Application the representative of the Merchant hereby confirms that:
                            </p>
                            <ul className="list-disc space-y-3 pl-5 marker:text-primary">
                                <li>
                                    <strong>Accuracy of Information:</strong> All information provided herein, including
                                    but not limited to company details, beneficial ownership, and operational structures,
                                    is true, complete, and accurate to the best of my knowledge.
                                </li>
                                <li>
                                    <strong>Legal Compliance:</strong> The Merchant is not involved in any illegal
                                    activity, money laundering, or financing of terrorism. The business operations comply
                                    with all local and international laws applicable to the jurisdiction of registration.
                                </li>
                                <li>
                                    <strong>Authority to Sign:</strong> The representative signing this document has full
                                    legal authority and capacity to bind the Merchant to this agreement.
                                </li>
                                <li>
                                    <strong>Terms of Service:</strong> The Merchant has read, understood, and agrees to be
                                    bound by the{' '}
                                    <span className="text-primary cursor-not-allowed">Terms of Service</span> and{' '}
                                    <span className="text-primary cursor-not-allowed">Privacy Policy</span> of Ex-Payments.
                                </li>
                                <li>
                                    <strong>Data Processing:</strong> I acknowledge and consent to the processing of
                                    personal and corporate data for the purpose of due diligence and ongoing account
                                    management as described in the Data Processing Agreement.
                                </li>
                                <li>
                                    <strong>Fee Structure:</strong> I accept the fee schedule provided in the previous step
                                    and understand that transaction fees will be deducted automatically from settlements.
                                </li>
                                <li>
                                    <strong>Termination:</strong> I understand that Ex-Payments reserves the right to
                                    terminate services immediately if any provided information is found to be false or if
                                    the Merchant engages in prohibited activities.
                                </li>
                                <li>
                                    <strong>Digital Signature:</strong> This electronic signature carries the same legal
                                    weight as a wet ink signature under the Electronic Identification, Authentication and
                                    Trust Services (eIDAS) regulation.
                                </li>
                            </ul>
                            <p className="mt-6 pt-6 border-t border-slate-200">
                                This declaration is made on{' '}
                                <span className="font-medium text-text-main">{today}</span> and is binding upon
                                submission.
                            </p>
                        </div>
                    </div>

                    {/* Signature Section */}
                    <div className="space-y-6">
                        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-100 pb-2">
                            <h3 className="text-lg font-bold text-text-main">Application filled and signed by</h3>
                            <span className="text-sm font-medium text-slate-400 bg-slate-50 px-3 py-1 rounded-full">
                                {today}
                            </span>
                        </div>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
                            {/* Title */}
                            <div className="md:col-span-2">
                                <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500" htmlFor="title">
                                    Title *
                                </label>
                                <select
                                    {...register('step5.title')}
                                    className="w-full rounded-xl border-slate-200 bg-white py-3 pl-4 pr-10 text-text-main focus:border-primary focus:ring-primary"
                                    id="title"
                                >
                                    <option value="" disabled>Select</option>
                                    <option>Mr.</option>
                                    <option>Ms.</option>
                                    <option>Mrs.</option>
                                    <option>Dr.</option>
                                </select>
                            </div>
                            {/* First Name */}
                            <div className="md:col-span-5">
                                <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500" htmlFor="sign_name">
                                    First Name *
                                </label>
                                <input
                                    {...register('step5.first_name')}
                                    className="w-full rounded-xl border-slate-200 py-3 px-4 text-text-main placeholder:text-slate-400 focus:border-primary focus:ring-primary"
                                    id="sign_name"
                                    placeholder="e.g. Jonathan"
                                    type="text"
                                />
                            </div>
                            {/* Surname */}
                            <div className="md:col-span-5">
                                <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500" htmlFor="sign_surname">
                                    Surname *
                                </label>
                                <input
                                    {...register('step5.last_name')}
                                    className="w-full rounded-xl border-slate-200 py-3 px-4 text-text-main placeholder:text-slate-400 focus:border-primary focus:ring-primary"
                                    id="sign_surname"
                                    placeholder="e.g. Doe"
                                    type="text"
                                />
                            </div>
                        </div>

                        {/* Warning */}
                        <div className="mt-6 flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 p-4 text-red-700">
                            <AlertTriangle className="h-5 w-5 shrink-0 text-red-500" />
                            <div className="text-sm">
                                <span className="font-bold">Warning:</span> After signing, you cannot change the provided
                                information. Please review all previous steps if you are unsure about any details.
                            </div>
                        </div>
                    </div>
                </div>

                {submitError && (
                    <div className="mx-6 sm:mx-8 mb-0 mt-4 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700 text-sm">
                        <AlertTriangle className="h-5 w-5 shrink-0 text-red-500 mt-0.5" />
                        <span>{submitError}</span>
                    </div>
                )}
                {/* Action Footer */}
                <div className="flex flex-col sm:flex-row items-center justify-between border-t border-slate-100 bg-slate-50/50 px-6 sm:px-8 py-6 gap-4">
                    <StepActions
                        nextLabel={viewMode ? 'Back to Dashboard' : 'Sign and Finish'}
                        nextHref={viewMode ? '/dashboard' : undefined}
                        prevHref={viewMode && applicationId ? `/application/step-4${viewQuery}` : '/application/step-4'}
                        variant={viewMode ? 'default' : 'final'}
                        onSubmit={viewMode ? undefined : handleSignAndFinish}
                        isSubmitting={isSubmitting}
                        onSaveDraft={viewMode ? undefined : () => {
                            const flatPatch = flattenToDottedKeys(watch() as unknown as Record<string, unknown>);
                            saveDraft(flatPatch, progressPercent);
                        }}
                        isSaving={isSaving}
                        hasSaved={!!lastSavedAt}
                    />
                </div>
            </div>

            {/* Footer Links */}
            <div className="mt-12 flex justify-center gap-8 text-sm text-slate-400">
                <span className="cursor-not-allowed">Privacy Policy</span>
                <span className="cursor-not-allowed">Terms &amp; Conditions</span>
                <span className="cursor-not-allowed">Support</span>
            </div>
            </fieldset>
        </form>
    );
}

export default function ApplicationStep5Page() {
    return (
        <Suspense fallback={
            <div className="flex flex-col items-center justify-center py-20 min-h-[50vh]">
                <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
                <p className="text-slate-500 font-medium animate-pulse">Loading...</p>
            </div>
        }>
            <Step5Content />
        </Suspense>
    );
}
