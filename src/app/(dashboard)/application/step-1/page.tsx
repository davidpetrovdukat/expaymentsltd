'use client';

import { Suspense, useEffect, useRef } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useRouter, useSearchParams } from 'next/navigation';
import { StepProgress } from '@/components/application/StepProgress';
import { FormSection } from '@/components/application/FormSection';
import { StepActions } from '@/components/application/StepActions';
import { Globe, Calendar, Send, Loader2 } from 'lucide-react';
import { useDraft, flattenToDottedKeys } from '@/components/application/useDraft';
import { COUNTRY_OPTIONS } from '@/lib/countries';
import { cn } from '@/lib/utils';

interface Step1FormData {
    'step1.company_name': string;
    'step1.company_number': string;
    'step1.vat_number': string;
    'step1.incorporation_country': string;
    'step1.incorporation_date': string;
    'step1.corporate_phone': string;
    'step1.corporate_email': string;
    'step1.corporate_website': string;
    'step1.street': string;
    'step1.city': string;
    'step1.area': string;
    'step1.post_code': string;
    'step1.contact_first_name': string;
    'step1.contact_surname': string;
    'step1.contact_telephone': string;
    'step1.contact_email': string;
    'step1.contact_telegram': string;
}

const R = { required: 'Required' } as const;

function Step1Content() {
    const currentStep = 1;
    const progressPercent = 0;
    const router = useRouter();
    const searchParams = useSearchParams();
    const viewMode = searchParams.get('mode') === 'view';
    const applicationId = searchParams.get('applicationId');
    const viewQuery = applicationId ? `?mode=view&applicationId=${applicationId}` : '';

    const { initialData, isLoading, isSaving, lastSavedAt, error, autoSave, saveDraft, isHydrated, status } = useDraft(currentStep);
    const skipNextSaveRef = useRef(false);
    const isRestoredRef = useRef(false);

    const { register, control, reset, handleSubmit, formState: { errors, isDirty } } = useForm<Step1FormData>({
        defaultValues: {
            'step1.company_name': '',
            'step1.company_number': '',
            'step1.vat_number': '',
            'step1.incorporation_country': '',
            'step1.incorporation_date': '',
            'step1.corporate_phone': '',
            'step1.corporate_email': '',
            'step1.corporate_website': '',
            'step1.street': '',
            'step1.city': '',
            'step1.area': '',
            'step1.post_code': '',
            'step1.contact_first_name': '',
            'step1.contact_surname': '',
            'step1.contact_telephone': '',
            'step1.contact_email': '',
            'step1.contact_telegram': '',
        }
    });

    function getErr(name: string): string | undefined {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let obj: any = errors;
        for (const part of name.split('.')) obj = obj?.[part];
        return obj?.message;
    }
    const e = (name: keyof Step1FormData) => getErr(name);
    const eCls = (name: keyof Step1FormData, base: string) =>
        cn(base, getErr(name) ? 'border-red-300' : '');

    useEffect(() => {
        if (isLoading) return;
        const step1Data = Object.keys(initialData)
            .filter(key => key.startsWith('step1.'))
            .reduce((acc, key) => {
                acc[key as keyof Step1FormData] = initialData[key] as never;
                return acc;
            }, {} as Partial<Step1FormData>);

        skipNextSaveRef.current = true;
        isRestoredRef.current = true;
        reset(step1Data);
    }, [isLoading, initialData, reset]);

    // useWatch is React Compiler-compatible; avoids the watch(callback) subscription pattern
    const autoSaveValues = useWatch({ control });
    useEffect(() => {
        if (!isHydrated || !isRestoredRef.current || !isDirty) return;
        if (skipNextSaveRef.current) {
            skipNextSaveRef.current = false;
            return;
        }
        const flatPatch = flattenToDottedKeys(autoSaveValues as unknown as Record<string, unknown>);
        const stepPatch = Object.fromEntries(Object.entries(flatPatch).filter(([k]) => k.startsWith('step1.')));
        if (Object.keys(stepPatch).length === 0) return;
        autoSave(stepPatch, progressPercent);
    }, [autoSaveValues, autoSave, progressPercent, isHydrated, isDirty]);

    function handleNext() {
        if (status && status !== 'DRAFT') {
            router.push('/application/step-2');
            return;
        }
        handleSubmit(
            () => router.push('/application/step-2'),
            () => {}
        )();
    }

    if (isLoading) {
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
        <form onSubmit={(ev) => ev.preventDefault()}>
            <fieldset disabled={viewMode} className="border-0 p-0 m-0 min-w-0">
            <div className="mb-10 text-center sm:text-left">
                <h1 className="text-3xl font-extrabold tracking-tight text-text-main sm:text-4xl mb-3">
                    Apply for a Merchant Account
                </h1>
                <p className="text-lg text-text-secondary max-w-3xl leading-relaxed">
                    Tell us about your business to get started. Complete this step-by-step application, and our
                    onboarding team will review it and get back to you with a tailored solution within 24 hours.
                </p>
            </div>

            <StepProgress currentStep={1} />

            <div className="rounded-xl border border-slate-100 bg-white p-6 sm:p-10 shadow-lg relative">
                <div className="absolute top-6 right-6 lg:top-10 lg:right-10 flex items-center gap-2 text-sm">
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

                <div className="mb-8 border-b border-slate-100 pb-6 pr-24">
                    <h2 className="text-2xl font-bold text-text-main flex items-center gap-3">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-sm shrink-0">1</span>
                        Company &amp; Contact Details
                    </h2>
                </div>

                <div className="space-y-10">
                    <FormSection title="Company Information">
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div className="col-span-1 sm:col-span-2">
                                <label className="mb-2 block text-sm font-medium text-text-main" htmlFor="step1.company_name">
                                    Company Name <span className="text-primary">*</span>
                                </label>
                                <input
                                    {...register('step1.company_name', R)}
                                    className={eCls('step1.company_name', 'block w-full rounded-xl border-slate-200 bg-background-light p-3 text-sm focus:border-primary focus:ring-primary placeholder:text-text-secondary shadow-sm')}
                                    id="step1.company_name"
                                    placeholder="e.g. Acme Corporation Ltd."
                                    type="text"
                                />
                                {e('step1.company_name') && <p className="text-red-500 text-xs mt-1">{e('step1.company_name')}</p>}
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-medium text-text-main" htmlFor="step1.company_number">
                                    Company Number <span className="text-primary">*</span>
                                </label>
                                <div className="relative">
                                    <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-text-secondary font-semibold text-sm select-none">№</span>
                                    <input
                                        {...register('step1.company_number', R)}
                                        className={eCls('step1.company_number', 'block w-full rounded-xl border-slate-200 bg-background-light p-3 pl-8 text-sm focus:border-primary focus:ring-primary placeholder:text-text-secondary shadow-sm')}
                                        id="step1.company_number"
                                        placeholder="e.g. 12345678"
                                        type="text"
                                    />
                                </div>
                                {e('step1.company_number') && <p className="text-red-500 text-xs mt-1">{e('step1.company_number')}</p>}
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-medium text-text-main" htmlFor="step1.vat_number">
                                    VAT Number
                                </label>
                                <div className="relative">
                                    <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-text-secondary font-semibold text-sm select-none">№</span>
                                    <input
                                        {...register('step1.vat_number')}
                                        className="block w-full rounded-xl border-slate-200 bg-background-light p-3 pl-8 text-sm focus:border-primary focus:ring-primary placeholder:text-text-secondary shadow-sm"
                                        id="step1.vat_number"
                                        placeholder="Optional"
                                        type="text"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-medium text-text-main" htmlFor="step1.incorporation_country">
                                    Incorporation Country <span className="text-primary">*</span>
                                </label>
                                <select
                                    {...register('step1.incorporation_country', R)}
                                    className={eCls('step1.incorporation_country', 'block w-full rounded-xl border-slate-200 bg-background-light p-3 text-sm focus:border-primary focus:ring-primary shadow-sm')}
                                    id="step1.incorporation_country"
                                >
                                    <option value="" disabled>Select a country</option>
                                    {COUNTRY_OPTIONS.map(({ value, label }) => (
                                        <option key={value} value={value}>{label}</option>
                                    ))}
                                </select>
                                {e('step1.incorporation_country') && <p className="text-red-500 text-xs mt-1">{e('step1.incorporation_country')}</p>}
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-medium text-text-main" htmlFor="step1.incorporation_date">
                                    Incorporation Date <span className="text-primary">*</span>
                                </label>
                                <div className="relative">
                                    <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-text-secondary">
                                        <Calendar className="h-4 w-4" />
                                    </span>
                                    <input
                                        {...register('step1.incorporation_date', R)}
                                        className={eCls('step1.incorporation_date', 'block w-full rounded-xl border-slate-200 bg-background-light p-3 pl-10 text-sm focus:border-primary focus:ring-primary text-text-secondary shadow-sm')}
                                        id="step1.incorporation_date"
                                        type="date"
                                    />
                                </div>
                                {e('step1.incorporation_date') && <p className="text-red-500 text-xs mt-1">{e('step1.incorporation_date')}</p>}
                            </div>
                        </div>
                    </FormSection>

                    <hr className="border-slate-100" />

                    <FormSection title="Legal Address &amp; Contact">
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-text-main" htmlFor="step1.corporate_phone">
                                    Corporate Phone <span className="text-primary">*</span>
                                </label>
                                <input
                                    {...register('step1.corporate_phone', R)}
                                    className={eCls('step1.corporate_phone', 'block w-full rounded-xl border-slate-200 bg-background-light p-3 text-sm focus:border-primary focus:ring-primary placeholder:text-text-secondary shadow-sm')}
                                    id="step1.corporate_phone"
                                    placeholder="+1 (555) 000-0000"
                                    type="tel"
                                />
                                {e('step1.corporate_phone') && <p className="text-red-500 text-xs mt-1">{e('step1.corporate_phone')}</p>}
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-medium text-text-main" htmlFor="step1.corporate_email">
                                    Corporate E-mail <span className="text-primary">*</span>
                                </label>
                                <input
                                    {...register('step1.corporate_email', R)}
                                    className={eCls('step1.corporate_email', 'block w-full rounded-xl border-slate-200 bg-background-light p-3 text-sm focus:border-primary focus:ring-primary placeholder:text-text-secondary shadow-sm')}
                                    id="step1.corporate_email"
                                    placeholder="info@company.com"
                                    type="email"
                                />
                                {e('step1.corporate_email') && <p className="text-red-500 text-xs mt-1">{e('step1.corporate_email')}</p>}
                            </div>
                            <div className="sm:col-span-2">
                                <label className="mb-2 block text-sm font-medium text-text-main" htmlFor="step1.corporate_website">
                                    Corporate Website
                                </label>
                                <div className="relative">
                                    <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-text-secondary">
                                        <Globe className="h-4 w-4" />
                                    </span>
                                    <input
                                        {...register('step1.corporate_website')}
                                        className="block w-full rounded-xl border-slate-200 bg-background-light p-3 pl-10 text-sm focus:border-primary focus:ring-primary placeholder:text-text-secondary shadow-sm"
                                        id="step1.corporate_website"
                                        placeholder="https://"
                                        type="url"
                                    />
                                </div>
                            </div>
                            <div className="sm:col-span-2">
                                <label className="mb-2 block text-sm font-medium text-text-main" htmlFor="step1.street">
                                    Street, building, office <span className="text-primary">*</span>
                                </label>
                                <input
                                    {...register('step1.street', R)}
                                    className={eCls('step1.street', 'block w-full rounded-xl border-slate-200 bg-background-light p-3 text-sm focus:border-primary focus:ring-primary placeholder:text-text-secondary shadow-sm')}
                                    id="step1.street"
                                    placeholder="e.g. 123 Business Blvd, Suite 400"
                                    type="text"
                                />
                                {e('step1.street') && <p className="text-red-500 text-xs mt-1">{e('step1.street')}</p>}
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-medium text-text-main" htmlFor="step1.city">
                                    City <span className="text-primary">*</span>
                                </label>
                                <input
                                    {...register('step1.city', R)}
                                    className={eCls('step1.city', 'block w-full rounded-xl border-slate-200 bg-background-light p-3 text-sm focus:border-primary focus:ring-primary placeholder:text-text-secondary shadow-sm')}
                                    id="step1.city"
                                    placeholder="City Name"
                                    type="text"
                                />
                                {e('step1.city') && <p className="text-red-500 text-xs mt-1">{e('step1.city')}</p>}
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-medium text-text-main" htmlFor="step1.area">
                                    Area / State
                                </label>
                                <input
                                    {...register('step1.area')}
                                    className="block w-full rounded-xl border-slate-200 bg-background-light p-3 text-sm focus:border-primary focus:ring-primary placeholder:text-text-secondary shadow-sm"
                                    id="step1.area"
                                    placeholder="Optional"
                                    type="text"
                                />
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-medium text-text-main" htmlFor="step1.post_code">
                                    Post Code <span className="text-primary">*</span>
                                </label>
                                <input
                                    {...register('step1.post_code', R)}
                                    className={eCls('step1.post_code', 'block w-full rounded-xl border-slate-200 bg-background-light p-3 text-sm focus:border-primary focus:ring-primary placeholder:text-text-secondary shadow-sm')}
                                    id="step1.post_code"
                                    placeholder="ZIP / Postal Code"
                                    type="text"
                                />
                                {e('step1.post_code') && <p className="text-red-500 text-xs mt-1">{e('step1.post_code')}</p>}
                            </div>
                        </div>
                    </FormSection>

                    <hr className="border-slate-100" />

                    <FormSection title="Contact Person" badge="Primary Contact">
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-text-main" htmlFor="step1.contact_first_name">
                                    First Name <span className="text-primary">*</span>
                                </label>
                                <input
                                    {...register('step1.contact_first_name', R)}
                                    className={eCls('step1.contact_first_name', 'block w-full rounded-xl border-slate-200 bg-background-light p-3 text-sm focus:border-primary focus:ring-primary placeholder:text-text-secondary shadow-sm')}
                                    id="step1.contact_first_name"
                                    placeholder="Jane"
                                    type="text"
                                />
                                {e('step1.contact_first_name') && <p className="text-red-500 text-xs mt-1">{e('step1.contact_first_name')}</p>}
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-medium text-text-main" htmlFor="step1.contact_surname">
                                    Surname <span className="text-primary">*</span>
                                </label>
                                <input
                                    {...register('step1.contact_surname', R)}
                                    className={eCls('step1.contact_surname', 'block w-full rounded-xl border-slate-200 bg-background-light p-3 text-sm focus:border-primary focus:ring-primary placeholder:text-text-secondary shadow-sm')}
                                    id="step1.contact_surname"
                                    placeholder="Doe"
                                    type="text"
                                />
                                {e('step1.contact_surname') && <p className="text-red-500 text-xs mt-1">{e('step1.contact_surname')}</p>}
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-medium text-text-main" htmlFor="step1.contact_telephone">
                                    Telephone <span className="text-primary">*</span>
                                </label>
                                <input
                                    {...register('step1.contact_telephone', R)}
                                    className={eCls('step1.contact_telephone', 'block w-full rounded-xl border-slate-200 bg-background-light p-3 text-sm focus:border-primary focus:ring-primary placeholder:text-text-secondary shadow-sm')}
                                    id="step1.contact_telephone"
                                    placeholder="+1 (555) 000-0000"
                                    type="tel"
                                />
                                {e('step1.contact_telephone') && <p className="text-red-500 text-xs mt-1">{e('step1.contact_telephone')}</p>}
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-medium text-text-main" htmlFor="step1.contact_email">
                                    Email <span className="text-primary">*</span>
                                </label>
                                <input
                                    {...register('step1.contact_email', R)}
                                    className={eCls('step1.contact_email', 'block w-full rounded-xl border-slate-200 bg-background-light p-3 text-sm focus:border-primary focus:ring-primary placeholder:text-text-secondary shadow-sm')}
                                    id="step1.contact_email"
                                    placeholder="jane.doe@company.com"
                                    type="email"
                                />
                                {e('step1.contact_email') && <p className="text-red-500 text-xs mt-1">{e('step1.contact_email')}</p>}
                            </div>
                            <div className="sm:col-span-2">
                                <label className="mb-2 block text-sm font-medium text-text-main" htmlFor="step1.contact_telegram">
                                    Telegram (Optional)
                                </label>
                                <div className="relative">
                                    <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-text-secondary">
                                        <Send className="h-4 w-4" />
                                    </span>
                                    <input
                                        {...register('step1.contact_telegram')}
                                        className="block w-full rounded-xl border-slate-200 bg-background-light p-3 pl-10 text-sm focus:border-primary focus:ring-primary placeholder:text-text-secondary shadow-sm"
                                        id="step1.contact_telegram"
                                        placeholder="@username"
                                        type="text"
                                    />
                                </div>
                            </div>
                        </div>
                    </FormSection>

                    <StepActions
                        nextLabel="Next Step: Business Details"
                        nextHref={viewMode && applicationId ? `/application/step-2${viewQuery}` : '/application/step-2'}
                        onBeforeNext={viewMode ? undefined : handleNext}
                        onSaveDraft={viewMode ? undefined : () => {
                            const flatPatch = flattenToDottedKeys(autoSaveValues as unknown as Record<string, unknown>);
                            saveDraft(flatPatch, progressPercent);
                        }}
                        isSaving={isSaving}
                        hasSaved={!!lastSavedAt}
                    />
                </div>
            </div>
            </fieldset>
        </form>
    );
}

export default function ApplicationStep1Page() {
    return (
        <Suspense fallback={
            <div className="flex flex-col items-center justify-center py-20 min-h-[50vh]">
                <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
                <p className="text-slate-500 font-medium animate-pulse">Loading...</p>
            </div>
        }>
            <Step1Content />
        </Suspense>
    );
}
