/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Suspense, useEffect, useRef } from 'react';
import { useForm, useFieldArray, Controller, useWatch } from 'react-hook-form';
import { useRouter, useSearchParams } from 'next/navigation';
import { StepProgress } from '@/components/application/StepProgress';
import { FormSection } from '@/components/application/FormSection';
import { StepActions } from '@/components/application/StepActions';
import { ToggleField } from '@/components/application/ToggleField';
import { PlusCircle, Trash2, Loader2 } from 'lucide-react';
import { useDraft, flattenToDottedKeys } from '@/components/application/useDraft';
import { COUNTRY_OPTIONS } from '@/lib/countries';
import { cn } from '@/lib/utils';

interface Person {
    type: 'Person' | 'Company';
    first_name: string;
    last_name: string;
    dob: string;
    citizenship: string;
    passport_number: string;
    identity_code: string;
    issue_date: string;
    expiry_date: string;
    issuing_country: string;
    issuing_authority: string;
    residence_country: string;

    // Contact
    living_address: string;
    city: string;
    postal_code: string;
    telephone: string;
    email: string;

    // Compliance
    is_us_person: boolean;
    is_pep: boolean;
    pep_roles: string[];
    has_criminal_record: boolean;

    // Rights
    rep_rights: string;
    rep_rights_details: string;
    positions: string[];
    position_details: string;

    // Shareholder
    is_shareholder: boolean;
    shareholder_percent: string;

    // UBO
    is_ubo: boolean;
    ubo_share_percent: string;
    ubo_ownership_type: string;
    ubo_tax_residence: string;
    ubo_tax_id: string;
    ubo_fund_sources: string[];

    // Company-specific (when type === 'Company')
    company_name: string;
    company_reg_number: string;
    company_type: string;
    company_jurisdiction: string;
    company_address: string;
}

interface Step4FormData {
    'step4.persons': Person[];
}

const DEFAULT_PERSON: Person = {
    type: 'Person',
    first_name: '',
    last_name: '',
    dob: '',
    citizenship: '',
    passport_number: '',
    identity_code: '',
    issue_date: '',
    expiry_date: '',
    issuing_country: '',
    issuing_authority: '',
    residence_country: '',
    living_address: '',
    city: '',
    postal_code: '',
    telephone: '',
    email: '',
    is_us_person: false,
    is_pep: false,
    pep_roles: [],
    has_criminal_record: false,
    rep_rights: '',
    rep_rights_details: '',
    positions: [],
    position_details: '',
    is_shareholder: false,
    shareholder_percent: '',
    is_ubo: false,
    ubo_share_percent: '',
    ubo_ownership_type: '',
    ubo_tax_residence: '',
    ubo_tax_id: '',
    ubo_fund_sources: [],
    company_name: '',
    company_reg_number: '',
    company_type: '',
    company_jurisdiction: '',
    company_address: '',
};

const R = { required: 'Required' } as const;

function Step4Content() {
    const currentStep = 4;
    const progressPercent = 60;
    const router = useRouter();
    const searchParams = useSearchParams();
    const viewMode = searchParams.get('mode') === 'view';
    const applicationId = searchParams.get('applicationId');
    const viewQuery = applicationId ? `?mode=view&applicationId=${applicationId}` : '';

    const { initialData, isLoading, isSaving, lastSavedAt, error, autoSave, saveDraft, isHydrated, status } = useDraft(currentStep);
    const skipNextSaveRef = useRef(false);
    const isRestoredRef = useRef(false);

    const { register, control, reset, setValue, handleSubmit, setError, clearErrors, getValues, formState: { errors } } = useForm<Step4FormData>({
        defaultValues: {
            'step4.persons': [{ ...DEFAULT_PERSON }],
        }
    });

    const {
        fields: persons,
        append: appendPerson,
        remove: removePerson,
        replace: replacePersons
    } = useFieldArray({
        control,
        name: 'step4.persons'
    });

    // Restore draft values on load — fires once when useDraft finishes loading
    useEffect(() => {
        // Wait until useDraft has finished fetching
        if (isLoading) return;

        const step4Data = Object.keys(initialData)
            .filter(key => key.startsWith('step4.'))
            .reduce((acc, key) => {
                acc[key as keyof Step4FormData] = initialData[key] as never;
                return acc;
            }, {} as Partial<Step4FormData>);

        // Ensure there is always at least one person, even if draft array was empty
        if (!step4Data['step4.persons'] || (step4Data['step4.persons'] as Person[]).length === 0) {
            step4Data['step4.persons'] = [{ ...DEFAULT_PERSON }];
        }

        skipNextSaveRef.current = true;
        isRestoredRef.current = true;
        reset(step4Data);

        const restoredPersons = (step4Data['step4.persons'] as Person[]) ?? [{ ...DEFAULT_PERSON }];
        const isoLookup = new Map(COUNTRY_OPTIONS.map(c => [c.label.toLowerCase(), c.value]));
        const normalized = restoredPersons.map(p => ({
            ...p,
            citizenship: isoLookup.get((p.citizenship || '').toLowerCase()) || p.citizenship || '',
            issuing_country: isoLookup.get((p.issuing_country || '').toLowerCase()) || p.issuing_country || '',
            residence_country: isoLookup.get((p.residence_country || '').toLowerCase()) || p.residence_country || '',
            ubo_tax_residence: isoLookup.get((p.ubo_tax_residence || '').toLowerCase()) || p.ubo_tax_residence || '',
            company_jurisdiction: isoLookup.get((p.company_jurisdiction || '').toLowerCase()) || p.company_jurisdiction || '',
        }));
        replacePersons(normalized);
    }, [isLoading, initialData, reset, replacePersons]);

    // useWatch is React Compiler-compatible; avoids the watch(callback) subscription pattern
    const autoSaveValues = useWatch({ control });
    useEffect(() => {
        if (!isHydrated || !isRestoredRef.current) return;
        if (skipNextSaveRef.current) {
            skipNextSaveRef.current = false;
            return;
        }
        const flatPatch = flattenToDottedKeys(autoSaveValues as unknown as Record<string, unknown>);
        const stepPatch = Object.fromEntries(Object.entries(flatPatch).filter(([k]) => k.startsWith('step4.')));
        if (Object.keys(stepPatch).length === 0) return;
        autoSave(stepPatch, progressPercent);
    }, [autoSaveValues, autoSave, progressPercent, isHydrated]);

    function pErr(personIdx: number, field: string): string | undefined {
        const personErrors = (errors as any)?.step4?.persons?.[personIdx];
        return personErrors?.[field]?.message;
    }
    function pErrCls(personIdx: number, field: string, base: string): string {
        return cn(base, pErr(personIdx, field) ? 'border-red-300' : '');
    }

    function handleNext() {
        if (status && status !== 'DRAFT') {
            router.push('/application/step-5');
            return;
        }
        clearErrors();

        handleSubmit(
            () => {
                const raw = getValues();
                const persons = (
                    (raw as any)?.step4?.persons ??
                    (raw as any)?.['step4.persons'] ??
                    []
                ) as Person[];
                let hasConditionalError = false;
                const sErr = (idx: number, f: string, msg = 'Required') => {
                    setError(`step4.persons.${idx}.${f}` as any, { type: 'manual', message: msg });
                    hasConditionalError = true;
                };
                const blank = (v: unknown) => !String(v ?? '').trim();

                persons.forEach((p: any, i: number) => {
                    const isCompany = p.type === 'Company';

                    if (isCompany) {
                        if (blank(p.company_name)) sErr(i, 'company_name');
                        if (blank(p.company_reg_number)) sErr(i, 'company_reg_number');
                        if (blank(p.company_jurisdiction)) sErr(i, 'company_jurisdiction');
                    } else {
                        if (blank(p.dob)) sErr(i, 'dob');
                        if (blank(p.citizenship)) sErr(i, 'citizenship');
                        if (blank(p.passport_number)) sErr(i, 'passport_number');
                        if (blank(p.issue_date)) sErr(i, 'issue_date');
                        if (blank(p.expiry_date)) {
                            sErr(i, 'expiry_date');
                        } else if (p.issue_date && p.expiry_date <= p.issue_date) {
                            sErr(i, 'expiry_date', 'Must be after Date of Issue');
                        }
                        if (blank(p.issuing_country)) sErr(i, 'issuing_country');
                        if (blank(p.residence_country)) sErr(i, 'residence_country');
                    }

                    if (p.is_pep && (!p.pep_roles || p.pep_roles.length === 0)) sErr(i, 'pep_roles', 'At least one role must be selected');
                    if (p.is_shareholder && blank(p.shareholder_percent)) sErr(i, 'shareholder_percent');
                    if (p.is_ubo) {
                        if (blank(p.ubo_share_percent)) sErr(i, 'ubo_share_percent');
                        if (blank(p.ubo_tax_residence)) sErr(i, 'ubo_tax_residence');
                        if (blank(p.ubo_tax_id)) sErr(i, 'ubo_tax_id');
                    }
                });
                if (!hasConditionalError) router.push('/application/step-5');
            },
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

    // Render error state
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

    // Derive persons from the same useWatch subscription used for autosave (no second hook call)
    const watchedPersons = ((autoSaveValues as any)?.step4?.persons ?? []) as Person[];

    return (
        <form onSubmit={(e) => e.preventDefault()}>
            <fieldset disabled={viewMode} className="border-0 p-0 m-0 min-w-0">
            {/* Header */}
            <div className="mb-8 flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-black text-text-main tracking-tight mb-2">
                        Step 4: Directors, Shareholders &amp; UBO
                    </h1>
                    <p className="text-text-secondary text-lg">
                        Please list all directors, major shareholders, and ultimate beneficial owners.
                    </p>
                </div>
                {/* Draft Status Indicator */}
                <div className="flex items-center gap-2 text-sm mt-2 md:mt-0">
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

            <StepProgress currentStep={4} />

            {/* Persons List */}
            {persons.map((personField, index) => {
                const personValues = (watchedPersons?.[index] || personField) as Person;
                const fieldPrefix = `step4.persons.${index}` as const;

                return (
                    <div key={personField.id} className="bg-white rounded-xl shadow-lg border border-slate-100 p-6 md:p-10 mb-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 bg-primary/10 text-primary font-bold text-xs uppercase px-4 py-2 rounded-bl-xl flex items-center gap-3">
                            Person {index + 1}
                            {persons.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removePerson(index)}
                                    className="text-red-500 hover:text-red-600 transition-colors"
                                    title="Remove Person"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            )}
                        </div>

                        {/* Section A: Personal Details */}
                        <FormSection title="Personal Details" letter="A">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div className="col-span-1 md:col-span-2">
                                    <label className="block text-xs font-semibold text-text-secondary mb-3 uppercase tracking-wider">
                                        Type
                                    </label>
                                    <div className="flex gap-6">
                                        {(['Person', 'Company'] as const).map((typeVal) => {
                                            const typeReg = register(`${fieldPrefix}.type`);
                                            return (
                                                <label key={typeVal} className="flex items-center gap-3 cursor-pointer">
                                                    <input
                                                        ref={typeReg.ref}
                                                        name={typeReg.name}
                                                        onBlur={typeReg.onBlur}
                                                        value={typeVal}
                                                        className="w-4 h-4 text-primary focus:ring-primary border-gray-300"
                                                        type="radio"
                                                        checked={personValues.type === typeVal}
                                                        onChange={(e) => {
                                                            typeReg.onChange(e);
                                                            if (typeVal === 'Company') {
                                                                setValue(`${fieldPrefix}.dob` as any, '');
                                                                setValue(`${fieldPrefix}.citizenship` as any, '');
                                                                setValue(`${fieldPrefix}.passport_number` as any, '');
                                                                setValue(`${fieldPrefix}.identity_code` as any, '');
                                                                setValue(`${fieldPrefix}.issue_date` as any, '');
                                                                setValue(`${fieldPrefix}.expiry_date` as any, '');
                                                                setValue(`${fieldPrefix}.issuing_country` as any, '');
                                                                setValue(`${fieldPrefix}.issuing_authority` as any, '');
                                                                setValue(`${fieldPrefix}.residence_country` as any, '');
                                                            } else {
                                                                setValue(`${fieldPrefix}.company_name` as any, '');
                                                                setValue(`${fieldPrefix}.company_reg_number` as any, '');
                                                                setValue(`${fieldPrefix}.company_type` as any, '');
                                                                setValue(`${fieldPrefix}.company_jurisdiction` as any, '');
                                                                setValue(`${fieldPrefix}.company_address` as any, '');
                                                            }
                                                        }}
                                                    />
                                                    <span className="text-sm font-medium">{typeVal}</span>
                                                </label>
                                            );
                                        })}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-text-main mb-2">
                                        {personValues.type === 'Company' ? 'Contact First Name' : 'First Name'} <span className="text-red-500">*</span>
                                    </label>
                                    <input {...register(`${fieldPrefix}.first_name`, R)} className={pErrCls(index, 'first_name', 'w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-text-main focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none')} placeholder="First Name" type="text" />
                                    {pErr(index, 'first_name') && <p className="text-red-500 text-xs mt-1">{pErr(index, 'first_name')}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-text-main mb-2">
                                        {personValues.type === 'Company' ? 'Contact Surname' : 'Surname'} <span className="text-red-500">*</span>
                                    </label>
                                    <input {...register(`${fieldPrefix}.last_name`, R)} className={pErrCls(index, 'last_name', 'w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-text-main focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none')} placeholder="Surname" type="text" />
                                    {pErr(index, 'last_name') && <p className="text-red-500 text-xs mt-1">{pErr(index, 'last_name')}</p>}
                                </div>

                                {personValues.type === 'Company' ? (
                                    <>
                                        <div>
                                            <label className="block text-sm font-medium text-text-main mb-2">Company Name <span className="text-red-500">*</span></label>
                                            <input {...register(`${fieldPrefix}.company_name`)} className={pErrCls(index, 'company_name', 'w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-text-main focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none')} placeholder="Company Name" type="text" />
                                            {pErr(index, 'company_name') && <p className="text-red-500 text-xs mt-1">{pErr(index, 'company_name')}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-text-main mb-2">Registration Number <span className="text-red-500">*</span></label>
                                            <input {...register(`${fieldPrefix}.company_reg_number`)} className={pErrCls(index, 'company_reg_number', 'w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-text-main focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none')} placeholder="Registration Number" type="text" />
                                            {pErr(index, 'company_reg_number') && <p className="text-red-500 text-xs mt-1">{pErr(index, 'company_reg_number')}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-text-main mb-2">Company Type</label>
                                            <input {...register(`${fieldPrefix}.company_type`)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-text-main focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" placeholder="e.g. LLC, Ltd, AG" type="text" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-text-main mb-2">Jurisdiction <span className="text-red-500">*</span></label>
                                            <select {...register(`${fieldPrefix}.company_jurisdiction`)} className={pErrCls(index, 'company_jurisdiction', 'w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-text-main focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none')}>
                                                <option value="" disabled>Select Country</option>
                                                {COUNTRY_OPTIONS.map(({ value, label }) => <option key={value} value={value}>{label}</option>)}
                                            </select>
                                            {pErr(index, 'company_jurisdiction') && <p className="text-red-500 text-xs mt-1">{pErr(index, 'company_jurisdiction')}</p>}
                                        </div>
                                        <div className="col-span-1 md:col-span-2">
                                            <label className="block text-sm font-medium text-text-main mb-2">Registered Address</label>
                                            <input {...register(`${fieldPrefix}.company_address`)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-text-main focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" placeholder="Full registered address" type="text" />
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div>
                                            <label className="block text-sm font-medium text-text-main mb-2">Date of Birth <span className="text-red-500">*</span></label>
                                            <input {...register(`${fieldPrefix}.dob`)} className={pErrCls(index, 'dob', 'w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-text-main focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none')} type="date" />
                                            {pErr(index, 'dob') && <p className="text-red-500 text-xs mt-1">{pErr(index, 'dob')}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-text-main mb-2">Country of Citizenship <span className="text-red-500">*</span></label>
                                            <select {...register(`${fieldPrefix}.citizenship`)} className={pErrCls(index, 'citizenship', 'w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-text-main focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none')}>
                                                <option value="" disabled>Select Country</option>
                                                {COUNTRY_OPTIONS.map(({ value, label }) => <option key={value} value={value}>{label}</option>)}
                                            </select>
                                            {pErr(index, 'citizenship') && <p className="text-red-500 text-xs mt-1">{pErr(index, 'citizenship')}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-text-main mb-2">Passport Number <span className="text-red-500">*</span></label>
                                            <input {...register(`${fieldPrefix}.passport_number`)} className={pErrCls(index, 'passport_number', 'w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-text-main focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none')} placeholder="Passport Number" type="text" />
                                            {pErr(index, 'passport_number') && <p className="text-red-500 text-xs mt-1">{pErr(index, 'passport_number')}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-text-main mb-2">Identity Code (if exists)</label>
                                            <input {...register(`${fieldPrefix}.identity_code`)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-text-main focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" placeholder="Identity Code" type="text" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-text-main mb-2">Date of Issue <span className="text-red-500">*</span></label>
                                            <input {...register(`${fieldPrefix}.issue_date`)} className={pErrCls(index, 'issue_date', 'w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-text-main focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none')} type="date" />
                                            {pErr(index, 'issue_date') && <p className="text-red-500 text-xs mt-1">{pErr(index, 'issue_date')}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-text-main mb-2">Date of Expiry <span className="text-red-500">*</span></label>
                                            <input {...register(`${fieldPrefix}.expiry_date`)} className={pErrCls(index, 'expiry_date', 'w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-text-main focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none')} type="date" />
                                            {pErr(index, 'expiry_date') && <p className="text-red-500 text-xs mt-1">{pErr(index, 'expiry_date')}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-text-main mb-2">Country Issuing <span className="text-red-500">*</span></label>
                                            <select {...register(`${fieldPrefix}.issuing_country`)} className={pErrCls(index, 'issuing_country', 'w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-text-main focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none')}>
                                                <option value="" disabled>Select Country</option>
                                                {COUNTRY_OPTIONS.map(({ value, label }) => <option key={value} value={value}>{label}</option>)}
                                            </select>
                                            {pErr(index, 'issuing_country') && <p className="text-red-500 text-xs mt-1">{pErr(index, 'issuing_country')}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-text-main mb-2">Issuing Authority</label>
                                            <input {...register(`${fieldPrefix}.issuing_authority`)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-text-main focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" placeholder="e.g. Passport Office" type="text" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-text-main mb-2">Country of Residence <span className="text-red-500">*</span></label>
                                            <select {...register(`${fieldPrefix}.residence_country`)} className={pErrCls(index, 'residence_country', 'w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-text-main focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none')}>
                                                <option value="" disabled>Select Country</option>
                                                {COUNTRY_OPTIONS.map(({ value, label }) => <option key={value} value={value}>{label}</option>)}
                                            </select>
                                            {pErr(index, 'residence_country') && <p className="text-red-500 text-xs mt-1">{pErr(index, 'residence_country')}</p>}
                                        </div>
                                    </>
                                )}
                            </div>
                        </FormSection>

                        <div className="border-b border-gray-100 mb-10" />

                        {/* Section B: Contact Information */}
                        <FormSection title="Contact Information" letter="B">
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-text-main mb-2">Living Address (Street, Building, Apt.) <span className="text-red-500">*</span></label>
                                    <input {...register(`${fieldPrefix}.living_address`, R)} className={pErrCls(index, 'living_address', 'w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-text-main focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none')} placeholder="123 Main St, Apt 4B" type="text" />
                                    {pErr(index, 'living_address') && <p className="text-red-500 text-xs mt-1">{pErr(index, 'living_address')}</p>}
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-text-main mb-2">City <span className="text-red-500">*</span></label>
                                        <input {...register(`${fieldPrefix}.city`, R)} className={pErrCls(index, 'city', 'w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-text-main focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none')} placeholder="City" type="text" />
                                        {pErr(index, 'city') && <p className="text-red-500 text-xs mt-1">{pErr(index, 'city')}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-text-main mb-2">Postal Code</label>
                                        <input {...register(`${fieldPrefix}.postal_code`)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-text-main focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" placeholder="Postal Code" type="text" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-text-main mb-2">Telephone <span className="text-red-500">*</span></label>
                                        <input {...register(`${fieldPrefix}.telephone`, R)} className={pErrCls(index, 'telephone', 'w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-text-main focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none')} placeholder="+44 20 1234 5678" type="tel" />
                                        {pErr(index, 'telephone') && <p className="text-red-500 text-xs mt-1">{pErr(index, 'telephone')}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-text-main mb-2">Email <span className="text-red-500">*</span></label>
                                        <input {...register(`${fieldPrefix}.email`, R)} className={pErrCls(index, 'email', 'w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-text-main focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none')} placeholder="name@example.com" type="email" />
                                        {pErr(index, 'email') && <p className="text-red-500 text-xs mt-1">{pErr(index, 'email')}</p>}
                                    </div>
                                </div>
                            </div>
                        </FormSection>

                        <div className="border-b border-gray-100 my-10" />

                        {/* Section C: Compliance */}
                        <FormSection title="Compliance" letter="C">
                            <div className="space-y-6">
                                <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                                    <Controller
                                        control={control}
                                        name={`${fieldPrefix}.is_us_person` as any}
                                        render={({ field: { value, onChange } }) => (
                                            <ToggleField
                                                label="Is the person citizen, tax resident of the US or US person?"
                                                checked={!!value}
                                                onCheckedChange={onChange}
                                            />
                                        )}
                                    />
                                </div>

                                <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                                    <Controller
                                        control={control}
                                        name={`${fieldPrefix}.is_pep` as any}
                                        render={({ field: { value, onChange } }) => (
                                            <ToggleField
                                                label="Is the person considered as Politically Exposed person?"
                                                checked={!!value}
                                                onCheckedChange={(val) => {
                                                    onChange(val);
                                                    if (!val) setValue(`${fieldPrefix}.pep_roles` as any, []);
                                                }}
                                            >
                                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-gray-200">
                                                    {['PEP', 'Family member', 'Close associate'].map((option) => (
                                                        <label key={option} className="flex items-center gap-2 cursor-pointer mt-2">
                                                            <input
                                                                {...register(`${fieldPrefix}.pep_roles`)}
                                                                value={option}
                                                                className="rounded border-gray-300 text-primary focus:ring-primary"
                                                                type="checkbox"
                                                            />
                                                            <span className="text-sm text-text-secondary">{option}</span>
                                                        </label>
                                                    ))}
                                                    {pErr(index, 'pep_roles') && <p className="text-red-500 text-xs mt-2 col-span-full">{pErr(index, 'pep_roles')}</p>}
                                                </div>
                                            </ToggleField>
                                        )}
                                    />
                                </div>

                                <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                                    <Controller
                                        control={control}
                                        name={`${fieldPrefix}.has_criminal_record` as any}
                                        render={({ field: { value, onChange } }) => (
                                            <ToggleField
                                                label="Existing criminal records"
                                                checked={!!value}
                                                onCheckedChange={onChange}
                                            />
                                        )}
                                    />
                                </div>
                            </div>
                        </FormSection>

                        <div className="border-b border-gray-100 my-10" />

                        {/* Section D: Role & Rights */}
                        <FormSection title="Role &amp; Rights" letter="D">
                            <div className="space-y-8">
                                {/* Representative Rights */}
                                <div>
                                    <label className="block text-xs font-semibold text-text-secondary mb-3 uppercase tracking-wider">
                                        Representative Rights
                                    </label>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-3">
                                        {['Sole signature', 'Joint signature', 'Other'].map((right) => (
                                            <label key={right} className={cn(
                                                "flex items-center gap-3 cursor-pointer p-3 rounded-lg border transition-colors",
                                                personValues.rep_rights === right ? "border-primary bg-primary/5" : "border-gray-200 hover:bg-gray-50"
                                            )}>
                                                <input
                                                    {...register(`${fieldPrefix}.rep_rights` as any)}
                                                    value={right}
                                                    className="w-4 h-4 text-primary focus:ring-primary border-gray-300"
                                                    type="radio"
                                                />
                                                <span className="text-sm">{right}</span>
                                            </label>
                                        ))}
                                    </div>
                                    <div className="ml-1">
                                        <label className="block text-xs font-medium text-text-secondary mb-1">Specify Rights</label>
                                        <input {...register(`${fieldPrefix}.rep_rights_details`)} className="w-full px-4 py-2 text-sm bg-white border border-gray-200 rounded-xl text-text-main focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" placeholder="Please specify..." type="text" />
                                    </div>
                                </div>

                                {/* Position */}
                                <div>
                                    <label className="block text-xs font-semibold text-text-secondary mb-3 uppercase tracking-wider">
                                        Position within company
                                    </label>
                                    <div className="flex flex-wrap gap-4 mb-3">
                                        {['Director', 'Member of the Board', 'Other'].map((pos) => (
                                            <label key={pos} className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    {...register(`${fieldPrefix}.positions`)}
                                                    value={pos}
                                                    className="rounded border-gray-300 text-primary focus:ring-primary"
                                                    type="checkbox"
                                                />
                                                <span className="text-sm">{pos}</span>
                                            </label>
                                        ))}
                                    </div>
                                    <div className="ml-1">
                                        <label className="block text-xs font-medium text-text-secondary mb-1">Specify Position</label>
                                        <input {...register(`${fieldPrefix}.position_details`)} className="w-full px-4 py-2 text-sm bg-white border border-gray-200 rounded-xl text-text-main focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" placeholder="Please specify..." type="text" />
                                    </div>
                                </div>

                                {/* Shareholder Toggle */}
                                <div className="p-5 bg-gray-50 rounded-lg border border-gray-200 shadow-sm">
                                    <Controller
                                        control={control}
                                        name={`${fieldPrefix}.is_shareholder` as any}
                                        render={({ field: { value, onChange } }) => (
                                            <ToggleField
                                                label="Is Shareholder?"
                                                checked={!!value}
                                                onCheckedChange={(val) => {
                                                    onChange(val);
                                                    if (!val) setValue(`${fieldPrefix}.shareholder_percent` as any, '');
                                                }}
                                            >
                                                <div className="border-t border-gray-200 pt-4 mt-2">
                                                    <label className="block text-sm font-medium text-text-main mb-2">Share in ownership (%) <span className="text-red-500">*</span></label>
                                                    <input {...register(`${fieldPrefix}.shareholder_percent`)} className={pErrCls(index, 'shareholder_percent', 'w-full md:w-1/2 px-4 py-3 bg-white border border-gray-200 rounded-xl text-text-main focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none')} placeholder="0" type="number" />
                                                    {pErr(index, 'shareholder_percent') && <p className="text-red-500 text-xs mt-1">{pErr(index, 'shareholder_percent')}</p>}
                                                </div>
                                            </ToggleField>
                                        )}
                                    />
                                </div>

                                {/* UBO Toggle */}
                                <div className="p-5 bg-gray-50 rounded-lg border border-gray-200 shadow-sm mt-6">
                                    <Controller
                                        control={control}
                                        name={`${fieldPrefix}.is_ubo` as any}
                                        render={({ field: { value, onChange } }) => (
                                            <ToggleField
                                                label="Is Ultimate Beneficial Owner (UBO)?"
                                                checked={!!value}
                                                onCheckedChange={(val) => {
                                                    onChange(val);
                                                    if (!val) {
                                                        setValue(`${fieldPrefix}.ubo_share_percent` as any, '');
                                                        setValue(`${fieldPrefix}.ubo_ownership_type` as any, '');
                                                        setValue(`${fieldPrefix}.ubo_tax_residence` as any, '');
                                                        setValue(`${fieldPrefix}.ubo_tax_id` as any, '');
                                                        setValue(`${fieldPrefix}.ubo_fund_sources` as any, []);
                                                    }
                                                }}
                                            >
                                                <div className="border-t border-gray-200 pt-5 mt-2 space-y-6">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                                                        <div>
                                                            <label className="block text-sm font-medium text-text-main mb-2">Share (%) <span className="text-red-500">*</span></label>
                                                            <input {...register(`${fieldPrefix}.ubo_share_percent`)} className={pErrCls(index, 'ubo_share_percent', 'w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-text-main focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none')} placeholder="0" type="number" />
                                                            {pErr(index, 'ubo_share_percent') && <p className="text-red-500 text-xs mt-1">{pErr(index, 'ubo_share_percent')}</p>}
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium text-text-main mb-3">Ownership Type</label>
                                                            <div className="flex flex-col gap-2">
                                                                {['Direct', 'Indirect Person', 'Indirect Company'].map((type) => (
                                                                    <label key={type} className="flex items-center gap-2 cursor-pointer">
                                                                        <input
                                                                            {...register(`${fieldPrefix}.ubo_ownership_type`)}
                                                                            value={type}
                                                                            className="text-primary focus:ring-primary"
                                                                            type="radio"
                                                                        />
                                                                        <span className="text-sm">{type}</span>
                                                                    </label>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                        <div>
                                                            <label className="block text-sm font-medium text-text-main mb-2">Tax Residence <span className="text-red-500">*</span></label>
                                                            <select {...register(`${fieldPrefix}.ubo_tax_residence`)} className={pErrCls(index, 'ubo_tax_residence', 'w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-text-main focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none')}>
                                                                <option value="" disabled>Select Country</option>
                                                                {COUNTRY_OPTIONS.map(({ value, label }) => <option key={value} value={value}>{label}</option>)}
                                                            </select>
                                                            {pErr(index, 'ubo_tax_residence') && <p className="text-red-500 text-xs mt-1">{pErr(index, 'ubo_tax_residence')}</p>}
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium text-text-main mb-2">Tax Identification No. <span className="text-red-500">*</span></label>
                                                            <input {...register(`${fieldPrefix}.ubo_tax_id`)} className={pErrCls(index, 'ubo_tax_id', 'w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-text-main focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none')} placeholder="123-456-789" type="text" />
                                                            {pErr(index, 'ubo_tax_id') && <p className="text-red-500 text-xs mt-1">{pErr(index, 'ubo_tax_id')}</p>}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-semibold text-text-secondary mb-3 uppercase tracking-wider">
                                                            Source of the UBO funds
                                                        </label>
                                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                                            {['Salary', 'Dividends', 'Personal Savings', 'Inheritance', 'Investment', 'Real Estate', 'Loan', 'Other'].map((source) => (
                                                                <label key={source} className="flex items-center gap-2 cursor-pointer">
                                                                    <input
                                                                        {...register(`${fieldPrefix}.ubo_fund_sources`)}
                                                                        value={source}
                                                                        className="rounded border-gray-300 text-primary focus:ring-primary"
                                                                        type="checkbox"
                                                                    />
                                                                    <span className="text-sm">{source}</span>
                                                                </label>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </ToggleField>
                                        )}
                                    />
                                </div>
                            </div>
                        </FormSection>
                    </div>
                );
            })}

            {/* Add Person Button */}
            <button
                type="button"
                onClick={() => appendPerson({ ...DEFAULT_PERSON })}
                className="w-full py-4 mb-10 border-2 border-dashed border-gray-300 rounded-xl text-primary font-bold hover:bg-primary/5 hover:border-primary transition-all flex items-center justify-center gap-2 group"
            >
                <PlusCircle className="h-5 w-5 group-hover:scale-110 transition-transform" />
                Add director or authorised representative
            </button>

            {/* Bottom Actions */}
            <StepActions
                nextLabel="Next Step: Declaration"
                nextHref={viewMode && applicationId ? `/application/step-5${viewQuery}` : '/application/step-5'}
                prevHref={viewMode && applicationId ? `/application/step-3${viewQuery}` : '/application/step-3'}
                onBeforeNext={viewMode ? undefined : handleNext}
                onSaveDraft={viewMode ? undefined : () => {
                    const flatPatch = flattenToDottedKeys(autoSaveValues as unknown as Record<string, unknown>);
                    const stepPatch = Object.fromEntries(Object.entries(flatPatch).filter(([k]) => k.startsWith('step4.')));
                    saveDraft(stepPatch, progressPercent);
                }}
                isSaving={isSaving}
                hasSaved={!!lastSavedAt}
            />
            </fieldset>
        </form>
    );
}

export default function ApplicationStep4Page() {
    return (
        <Suspense fallback={
            <div className="flex flex-col items-center justify-center py-20 min-h-[50vh]">
                <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
                <p className="text-slate-500 font-medium animate-pulse">Loading...</p>
            </div>
        }>
            <Step4Content />
        </Suspense>
    );
}
