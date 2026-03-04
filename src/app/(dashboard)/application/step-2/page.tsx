/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Suspense, useEffect, useRef } from 'react';
import { useForm, useFieldArray, useWatch } from 'react-hook-form';
import { useRouter, useSearchParams } from 'next/navigation';
import { StepProgress } from '@/components/application/StepProgress';
import { FormSection } from '@/components/application/FormSection';
import { StepActions } from '@/components/application/StepActions';
import { ToggleField } from '@/components/application/ToggleField';
import { Trash2, PlusCircle, Loader2 } from 'lucide-react';
import { useDraft, flattenToDottedKeys } from '@/components/application/useDraft';
import { cn } from '@/lib/utils';

interface Step2FormData {
    'step2.activity_base': string;
    'step2.activity_sub': string;
    'step2.url_address': string;
    'step2.domain_name': string;
    'step2.terminals_moto': boolean;
    'step2.terminals_ecommerce': boolean;
    'step2.terminals_3ds': boolean;
    'step2.mcc_code': string;
    'step2.mcc_undefined': boolean;
    'step2.business_description': string;
    'step2.goods_description': string;

    // Toggles
    'step2.is_licensed': boolean;
    'step2.license_number': string;
    'step2.license_issue_date': string;

    'step2.has_subscription': boolean;
    'step2.subscription_terms_url': string;

    'step2.has_country_restrictions': boolean;
    'step2.restricted_countries': string[];

    'step2.uses_own_gateway': boolean;

    'step2.has_own_stock': boolean;
    'step2.stock_locations': { country: string; city: string; postal: string; street: string }[];

    'step2.has_customer_identification': boolean;
    'step2.identification_details': string;

    'step2.has_cancellation_policy': boolean;
    'step2.cancellation_policy': string;

    // Suppliers (Arrays)
    'step2.suppliers': { name: string; country: string; url: string }[];
    'step2.shipping_terms': string;
}

function Step2Content() {
    "use no memo";
    const currentStep = 2;
    const progressPercent = 20;
    const searchParams = useSearchParams();
    const viewMode = searchParams.get('mode') === 'view';
    const applicationId = searchParams.get('applicationId');
    const viewQuery = applicationId ? `?mode=view&applicationId=${applicationId}` : '';

    const router = useRouter();
    const { initialData, isLoading, isSaving, lastSavedAt, error, autoSave, saveDraft, isHydrated, status } = useDraft(currentStep);
    const skipNextSaveRef = useRef(false);
    const isRestoredRef = useRef(false);

    const { register, control, reset, setValue, handleSubmit, getValues, formState: { errors } } = useForm<Step2FormData>({
        defaultValues: {
            'step2.activity_base': '',
            'step2.activity_sub': '',
            'step2.url_address': '',
            'step2.domain_name': '',
            'step2.terminals_moto': false,
            'step2.terminals_ecommerce': false,
            'step2.terminals_3ds': false,
            'step2.mcc_code': '',
            'step2.mcc_undefined': false,
            'step2.business_description': '',
            'step2.goods_description': '',
            'step2.is_licensed': false,
            'step2.license_number': '',
            'step2.license_issue_date': '',
            'step2.has_subscription': false,
            'step2.subscription_terms_url': '',
            'step2.has_country_restrictions': false,
            'step2.restricted_countries': [],
            'step2.uses_own_gateway': false,
            'step2.has_own_stock': false,
            'step2.stock_locations': [],
            'step2.has_customer_identification': false,
            'step2.identification_details': '',
            'step2.has_cancellation_policy': false,
            'step2.cancellation_policy': '',
            'step2.suppliers': [],
            'step2.shipping_terms': '',
        }
    });

    const {
        fields: stockLocations,
        append: appendStock,
        remove: removeStock,
        replace: replaceStock
    } = useFieldArray({
        control,
        name: 'step2.stock_locations'
    });

    const {
        fields: suppliers,
        append: appendSupplier,
        remove: removeSupplier,
        replace: replaceSuppliers
    } = useFieldArray({
        control,
        name: 'step2.suppliers'
    });

    // useWatch is React Compiler-compatible; avoids the watch(callback) subscription pattern
    const autoSaveValues = useWatch({ control });
    // Reactive states for toggles — derived from useWatch to avoid incompatible watch(field) calls
    const s2 = (autoSaveValues as any)?.step2 ?? {};
    const isLicensed = Boolean(s2.is_licensed);
    const hasSubscription = Boolean(s2.has_subscription);
    const hasCountryRestrictions = Boolean(s2.has_country_restrictions);
    const usesOwnGateway = Boolean(s2.uses_own_gateway);
    const hasOwnStock = Boolean(s2.has_own_stock);
    const hasCustomerIdentification = Boolean(s2.has_customer_identification);
    const hasCancellationPolicy = Boolean(s2.has_cancellation_policy);

    // Restore draft values on load
    useEffect(() => {
        if (isLoading) return;
        const step2Data = Object.keys(initialData)
            .filter(key => key.startsWith('step2.'))
            .reduce((acc, key) => {
                acc[key as keyof Step2FormData] = initialData[key] as never;
                return acc;
            }, {} as Partial<Step2FormData>);

        // Ensure at least one supplier exists if the DB had none
        if (!step2Data['step2.suppliers'] || step2Data['step2.suppliers'].length === 0) {
            step2Data['step2.suppliers'] = [{ name: '', country: '', url: '' }];
        }

        // Ensure stock_locations is an array
        if (!step2Data['step2.stock_locations']) {
            step2Data['step2.stock_locations'] = [];
        }

        skipNextSaveRef.current = true;
        isRestoredRef.current = true;
        reset(step2Data);

        const restoredStock = step2Data['step2.stock_locations'] as any[] ?? [];
        const restoredSuppliers = step2Data['step2.suppliers'] as any[] ?? [{ name: '', country: '', url: '' }];
        if (restoredStock.length > 0) replaceStock(restoredStock);
        replaceSuppliers(restoredSuppliers);

    }, [isLoading, initialData, reset, replaceStock, replaceSuppliers]);

    useEffect(() => {
        if (!isHydrated || !isRestoredRef.current) return;
        if (skipNextSaveRef.current) {
            skipNextSaveRef.current = false;
            return;
        }
        const flatPatch = flattenToDottedKeys(autoSaveValues as unknown as Record<string, unknown>);
        const stepPatch = Object.fromEntries(Object.entries(flatPatch).filter(([k]) => k.startsWith('step2.')));
        if (Object.keys(stepPatch).length === 0) return;
        autoSave(stepPatch, progressPercent);
    }, [autoSaveValues, autoSave, progressPercent, isHydrated]);

    function getErr(name: string): string | undefined {
        let obj: any = errors;
        for (const part of name.split('.')) obj = obj?.[part];
        return obj?.message;
    }

    function handleNext() {
        if (status && status !== 'DRAFT') {
            router.push('/application/step-3');
            return;
        }
        handleSubmit(
            () => router.push('/application/step-3'),
            () => {
                setTimeout(() => {
                    const el = document.querySelector('.border-red-300');
                    el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 50);
                window.alert('Please fill in all required fields before continuing.');
            }
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
            {/* Page Title Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <div className="flex items-center gap-2 text-primary font-medium text-sm mb-1">
                        <span>Application Process</span>
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold text-text-main tracking-tight">
                        Step 2: Business Information
                    </h1>
                    <p className="text-text-secondary mt-1">
                        Please provide details about your business activity and operations.
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

            <StepProgress currentStep={2} />

            <div className="space-y-6">
                {/* Group A: General Information */}
                <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 space-y-6">
                    <FormSection title="General Information">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <label className="block">
                                <span className="text-slate-700 font-medium text-sm mb-2 block">
                                    Base Activity
                                </span>
                                <input
                                    {...register('step2.activity_base')}
                                    className="w-full rounded-xl border-slate-200 bg-slate-50 focus:border-primary focus:ring-primary h-12 px-4 shadow-sm"
                                    placeholder="e.g. Retail, Services, Digital Goods"
                                    type="text"
                                />
                            </label>
                            <label className="block">
                                <span className="text-slate-700 font-medium text-sm mb-2 block">
                                    Sub Activity
                                </span>
                                <input
                                    {...register('step2.activity_sub')}
                                    className="w-full rounded-xl border-slate-200 bg-slate-50 focus:border-primary focus:ring-primary h-12 px-4 shadow-sm"
                                    placeholder="e.g. Clothing, Electronics, Consulting"
                                    type="text"
                                />
                            </label>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <label className="block">
                                <span className="text-slate-700 font-medium text-sm mb-2 block">
                                    URL Address
                                </span>
                                <input
                                    {...register('step2.url_address')}
                                    className="w-full rounded-xl border-slate-200 bg-slate-50 focus:border-primary focus:ring-primary h-12 px-4 shadow-sm"
                                    placeholder="https://www.yourbusiness.com"
                                    type="url"
                                />
                            </label>
                            <label className="block">
                                <span className="text-slate-700 font-medium text-sm mb-2 block">
                                    Owner of a domain name
                                </span>
                                <input
                                    {...register('step2.domain_name')}
                                    className="w-full rounded-xl border-slate-200 bg-slate-50 focus:border-primary focus:ring-primary h-12 px-4 shadow-sm"
                                    placeholder="Name and Surname, Company"
                                    type="text"
                                />
                            </label>
                        </div>
                        <div className="pt-4">
                            <span className="text-slate-700 font-medium text-sm mb-3 block">
                                Type of terminals
                            </span>
                            <div className="flex flex-wrap gap-4">
                                <label className="inline-flex items-center cursor-pointer bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 hover:border-primary/50 transition-colors">
                                    <input {...register('step2.terminals_moto')} className="rounded text-primary focus:ring-primary w-5 h-5 border-slate-300" type="checkbox" />
                                    <span className="ml-2 text-sm text-slate-700">MO/TO</span>
                                </label>
                                <label className="inline-flex items-center cursor-pointer bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 hover:border-primary/50 transition-colors">
                                    <input {...register('step2.terminals_ecommerce')} className="rounded text-primary focus:ring-primary w-5 h-5 border-slate-300" type="checkbox" />
                                    <span className="ml-2 text-sm text-slate-700">E-commerce</span>
                                </label>
                                <label className="inline-flex items-center cursor-pointer bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 hover:border-primary/50 transition-colors">
                                    <input {...register('step2.terminals_3ds')} className="rounded text-primary focus:ring-primary w-5 h-5 border-slate-300" type="checkbox" />
                                    <span className="ml-2 text-sm text-slate-700">3DS / VDV</span>
                                </label>
                            </div>
                        </div>
                    </FormSection>
                </div>

                {/* Group B: Classification */}
                <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 space-y-6">
                    <FormSection title="Classification">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                            <div>
                                <label className="block">
                                    <span className="text-slate-700 font-medium text-sm mb-2 block">
                                        MCC Code <span className="text-red-500">*</span>
                                    </span>
                                    <input
                                        {...register('step2.mcc_code', {
                                            validate: (value: string) => {
                                                const isUndefined = getValues('step2.mcc_undefined');
                                                if (!isUndefined && (!value || !value.trim())) return 'MCC Code is required (or check "Currently not defined")';
                                                return true;
                                            }
                                        })}
                                        className={cn('w-full rounded-xl border-slate-200 bg-slate-50 focus:border-primary focus:ring-primary h-12 px-4 shadow-sm', getErr('step2.mcc_code') && 'border-red-300')}
                                        placeholder="e.g. 5411"
                                        type="text"
                                    />
                                </label>
                                {getErr('step2.mcc_code') && <p className="text-red-500 text-xs mt-1">{getErr('step2.mcc_code')}</p>}
                            </div>
                            <div className="flex items-center h-12">
                                <label className="inline-flex items-center cursor-pointer group">
                                    <input
                                        {...register('step2.mcc_undefined')}
                                        className="rounded text-primary focus:ring-primary w-5 h-5 border-slate-300 bg-white"
                                        type="checkbox"
                                    />
                                    <span className="ml-3 text-sm text-slate-600 group-hover:text-primary transition-colors">
                                        Currently not defined
                                    </span>
                                </label>
                            </div>
                        </div>
                        <label className="block">
                            <span className="text-slate-700 font-medium text-sm mb-2 block">
                                Briefly describe your business activity
                            </span>
                            <textarea
                                {...register('step2.business_description')}
                                className="w-full rounded-xl border-slate-200 bg-slate-50 focus:border-primary focus:ring-primary p-4 resize-none shadow-sm"
                                placeholder="Explain what your business does..."
                                rows={3}
                            />
                        </label>
                        <div>
                            <label className="block">
                                <span className="text-slate-700 font-medium text-sm mb-2 block">
                                    Description of goods / services <span className="text-red-500">*</span>
                                </span>
                                <textarea
                                    {...register('step2.goods_description', { required: 'Required' })}
                                    className={cn('w-full rounded-xl border-slate-200 bg-slate-50 focus:border-primary focus:ring-primary p-4 resize-none shadow-sm', getErr('step2.goods_description') && 'border-red-300')}
                                    placeholder="List main products or services..."
                                    rows={3}
                                />
                            </label>
                            {getErr('step2.goods_description') && <p className="text-red-500 text-xs mt-1">{getErr('step2.goods_description')}</p>}
                        </div>
                    </FormSection>
                </div>

                {/* Group C: Compliance & Operations */}
                <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 space-y-8">
                    <FormSection title="Compliance &amp; Operations" badge="Required">

                        {/* Toggle 1: Licensing */}
                        <ToggleField
                            label="Additionally licensing or authorization is required to sell goods/provide services"
                            checked={isLicensed}
                            onCheckedChange={(val) => {
                                setValue('step2.is_licensed' as any, val);
                                if (!val) {
                                    setValue('step2.license_number' as any, '');
                                    setValue('step2.license_issue_date' as any, '');
                                }
                            }}
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <label className="block">
                                    <span className="text-slate-500 text-xs font-medium mb-1.5 block uppercase tracking-wide">
                                        License Number
                                    </span>
                                    <input
                                        {...register('step2.license_number')}
                                        className="w-full rounded-xl border-slate-200 bg-slate-50 text-sm h-10 px-3 shadow-sm focus:border-primary focus:ring-primary"
                                        type="text"
                                        placeholder="License number"
                                    />
                                </label>
                                <label className="block">
                                    <span className="text-slate-500 text-xs font-medium mb-1.5 block uppercase tracking-wide">
                                        License Issue Date
                                    </span>
                                    <input
                                        {...register('step2.license_issue_date')}
                                        className="w-full rounded-xl border-slate-200 bg-slate-50 text-sm h-10 px-3 shadow-sm focus:border-primary focus:ring-primary"
                                        type="date"
                                    />
                                </label>
                            </div>
                        </ToggleField>

                        <div className="border-t border-slate-100 pt-4" />

                        {/* Toggle 2: Subscription */}
                        <ToggleField
                            label="Are there any subscription products/services offered?"
                            checked={hasSubscription}
                            onCheckedChange={(val) => {
                                setValue('step2.has_subscription' as any, val);
                                if (!val) setValue('step2.subscription_terms_url' as any, '');
                            }}
                        >
                            <label className="block">
                                <span className="text-slate-500 text-xs font-medium mb-1.5 block uppercase tracking-wide">
                                    URL Address with Subscription Terms
                                </span>
                                <input
                                    {...register('step2.subscription_terms_url')}
                                    className="w-full rounded-xl border-slate-200 bg-slate-50 text-sm h-10 px-3 shadow-sm focus:border-primary focus:ring-primary"
                                    placeholder="https://..."
                                    type="url"
                                />
                            </label>
                        </ToggleField>

                        <div className="border-t border-slate-100 pt-4" />

                        {/* Toggle 3: Country Restrictions */}
                        <ToggleField
                            label="Do you have restrictions/URL access blocking from certain countries?"
                            checked={hasCountryRestrictions}
                            onCheckedChange={(val) => {
                                setValue('step2.has_country_restrictions' as any, val);
                                if (!val) setValue('step2.restricted_countries' as any, []);
                            }}
                        >
                            <label className="block">
                                <span className="text-slate-500 text-xs font-medium mb-1.5 block uppercase tracking-wide">
                                    Restricted Countries
                                </span>
                                <select
                                    {...register('step2.restricted_countries')}
                                    className="w-full rounded-xl border-slate-200 bg-slate-50 text-sm p-3 shadow-sm focus:border-primary focus:ring-primary h-24"
                                    multiple
                                >
                                    <option>North Korea</option>
                                    <option>Iran</option>
                                    <option>Syria</option>
                                    <option>Cuba</option>
                                </select>
                                <p className="text-xs text-slate-400 mt-1">Hold Ctrl/Cmd to select multiple</p>
                            </label>
                        </ToggleField>

                        <div className="border-t border-slate-100 pt-4" />

                        {/* Toggle 4: Own Payment Gateway */}
                        <ToggleField
                            label="Will you be using your own payment gateway?"
                            checked={usesOwnGateway}
                            onCheckedChange={(val) => {
                                setValue('step2.uses_own_gateway' as any, val);
                            }}
                        />

                        <div className="border-t border-slate-100 pt-4" />

                        {/* Toggle 5: Own Goods Stock */}
                        <ToggleField
                            label="Do you have your own goods stock?"
                            checked={hasOwnStock}
                            onCheckedChange={(val) => {
                                setValue('step2.has_own_stock' as any, val);
                                if (!val) setValue('step2.stock_locations' as any, []);
                            }}
                        >
                            <div className="space-y-3">
                                {stockLocations.map((field, index) => (
                                    <div key={field.id} className="grid grid-cols-12 gap-3 items-end">
                                        <div className="col-span-12 md:col-span-3">
                                            <label className="text-slate-500 text-xs font-medium mb-1 block uppercase tracking-wide">
                                                Country
                                            </label>
                                            <input
                                                {...register(`step2.stock_locations.${index}.country` as const)}
                                                className="w-full rounded-xl border-slate-200 bg-slate-50 text-sm h-10 px-3 shadow-sm focus:border-primary focus:ring-primary"
                                                type="text"
                                                placeholder="Country"
                                            />
                                        </div>
                                        <div className="col-span-6 md:col-span-3">
                                            <label className="text-slate-500 text-xs font-medium mb-1 block uppercase tracking-wide">
                                                City
                                            </label>
                                            <input
                                                {...register(`step2.stock_locations.${index}.city` as const)}
                                                className="w-full rounded-xl border-slate-200 bg-slate-50 text-sm h-10 px-3 shadow-sm focus:border-primary focus:ring-primary"
                                                type="text"
                                                placeholder="City"
                                            />
                                        </div>
                                        <div className="col-span-6 md:col-span-2">
                                            <label className="text-slate-500 text-xs font-medium mb-1 block uppercase tracking-wide">
                                                Postal
                                            </label>
                                            <input
                                                {...register(`step2.stock_locations.${index}.postal` as const)}
                                                className="w-full rounded-xl border-slate-200 bg-slate-50 text-sm h-10 px-3 shadow-sm focus:border-primary focus:ring-primary"
                                                type="text"
                                                placeholder="Postal"
                                            />
                                        </div>
                                        <div className="col-span-10 md:col-span-3">
                                            <label className="text-slate-500 text-xs font-medium mb-1 block uppercase tracking-wide">
                                                Street
                                            </label>
                                            <input
                                                {...register(`step2.stock_locations.${index}.street` as const)}
                                                className="w-full rounded-xl border-slate-200 bg-slate-50 text-sm h-10 px-3 shadow-sm focus:border-primary focus:ring-primary"
                                                type="text"
                                                placeholder="Street address"
                                            />
                                        </div>
                                        <div className="col-span-2 md:col-span-1 flex justify-end">
                                            <button
                                                type="button"
                                                onClick={() => removeStock(index)}
                                                className="h-10 w-10 flex items-center justify-center text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                            >
                                                <Trash2 className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </div>
                                ))}

                                <button
                                    type="button"
                                    onClick={() => appendStock({ country: '', city: '', postal: '', street: '' })}
                                    className="flex items-center gap-2 text-primary text-sm font-semibold hover:bg-primary/5 px-3 py-2 rounded-lg transition-colors"
                                >
                                    <PlusCircle className="h-4 w-4" />
                                    Add location
                                </button>
                            </div>
                        </ToggleField>

                        <div className="border-t border-slate-100 pt-4" />

                        {/* Toggle 6: Customer Identification */}
                        <ToggleField
                            label="Do you identify customers at delivery times?"
                            checked={hasCustomerIdentification}
                            onCheckedChange={(val) => {
                                setValue('step2.has_customer_identification' as any, val);
                                if (!val) setValue('step2.identification_details' as any, '');
                            }}
                        >
                            <label className="block">
                                <span className="text-slate-500 text-xs font-medium mb-1.5 block uppercase tracking-wide">
                                    Details of Identification
                                </span>
                                <textarea
                                    {...register('step2.identification_details')}
                                    className="w-full rounded-xl border-slate-200 bg-slate-50 text-sm p-3 shadow-sm focus:border-primary focus:ring-primary resize-none"
                                    placeholder="e.g. ID card check upon delivery..."
                                    rows={2}
                                />
                            </label>
                        </ToggleField>

                        <div className="border-t border-slate-100 pt-4" />

                        {/* Toggle 7: Cancellation */}
                        <ToggleField
                            label="Can customers cancel orders before delivery?"
                            checked={hasCancellationPolicy}
                            onCheckedChange={(val) => {
                                setValue('step2.has_cancellation_policy' as any, val);
                                if (!val) setValue('step2.cancellation_policy' as any, '');
                            }}
                        >
                            <label className="block">
                                <span className="text-slate-500 text-xs font-medium mb-1.5 block uppercase tracking-wide">
                                    Cancellation Deadline &amp; Refund Policy
                                </span>
                                <textarea
                                    {...register('step2.cancellation_policy')}
                                    className="w-full rounded-xl border-slate-200 bg-slate-50 text-sm p-3 shadow-sm focus:border-primary focus:ring-primary resize-none"
                                    placeholder="e.g. Up to 24 hours before scheduled delivery..."
                                    rows={2}
                                />
                            </label>
                        </ToggleField>
                    </FormSection>
                </div>

                {/* Group D: Suppliers */}
                <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 space-y-6">
                    <FormSection title="Main suppliers / courier companies">
                        <div className="space-y-4">
                            {suppliers.map((field, index) => (
                                <div key={field.id} className="grid grid-cols-12 gap-3 items-end">
                                    <div className="col-span-12 md:col-span-4">
                                        <label className="text-slate-500 text-xs font-medium mb-1 block uppercase tracking-wide">
                                            Full Name
                                        </label>
                                        <input
                                            {...register(`step2.suppliers.${index}.name` as const)}
                                            className="w-full rounded-xl border-slate-200 bg-slate-50 text-sm h-10 px-3 shadow-sm focus:border-primary focus:ring-primary"
                                            type="text"
                                            placeholder="Company name"
                                        />
                                    </div>
                                    <div className="col-span-6 md:col-span-3">
                                        <label className="text-slate-500 text-xs font-medium mb-1 block uppercase tracking-wide">
                                            Incorporation Country
                                        </label>
                                        <input
                                            {...register(`step2.suppliers.${index}.country` as const)}
                                            className="w-full rounded-xl border-slate-200 bg-slate-50 text-sm h-10 px-3 shadow-sm focus:border-primary focus:ring-primary"
                                            type="text"
                                            placeholder="Country"
                                        />
                                    </div>
                                    <div className="col-span-6 md:col-span-4">
                                        <label className="text-slate-500 text-xs font-medium mb-1 block uppercase tracking-wide">
                                            Web-page URL
                                        </label>
                                        <input
                                            {...register(`step2.suppliers.${index}.url` as const)}
                                            className="w-full rounded-xl border-slate-200 bg-slate-50 text-sm h-10 px-3 shadow-sm focus:border-primary focus:ring-primary"
                                            type="url"
                                            placeholder="https://..."
                                        />
                                    </div>
                                    <div className="col-span-12 md:col-span-1 flex justify-end md:justify-center pt-2 md:pt-0">
                                        <button
                                            type="button"
                                            onClick={() => removeSupplier(index)}
                                            className="h-10 w-10 flex items-center justify-center text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                        >
                                            <Trash2 className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                            ))}

                            <button
                                type="button"
                                onClick={() => appendSupplier({ name: '', country: '', url: '' })}
                                className="flex items-center gap-2 text-primary text-sm font-semibold hover:bg-primary/5 px-3 py-2 rounded-lg transition-colors"
                            >
                                <PlusCircle className="h-4 w-4" />
                                Add supplier
                            </button>
                        </div>
                        <div className="pt-4 border-t border-slate-100">
                            <label className="block">
                                <span className="text-slate-700 font-medium text-sm mb-2 block">
                                    Shipping terms (delivery/execution time and methods)
                                </span>
                                <textarea
                                    {...register('step2.shipping_terms')}
                                    className="w-full rounded-xl border-slate-200 bg-slate-50 focus:border-primary focus:ring-primary p-4 resize-none shadow-sm"
                                    placeholder="Describe standard shipping times and methods used..."
                                    rows={3}
                                />
                            </label>
                        </div>
                    </FormSection>
                </div>

                {/* Bottom Actions */}
                <StepActions
                    nextLabel="Next Step: Processing Profile"
                    nextHref={viewMode && applicationId ? `/application/step-3${viewQuery}` : '/application/step-3'}
                    prevHref={viewMode && applicationId ? `/application/step-1${viewQuery}` : '/application/step-1'}
                    onBeforeNext={viewMode ? undefined : handleNext}
                    onSaveDraft={viewMode ? undefined : () => {
                        const flatPatch = flattenToDottedKeys(autoSaveValues as unknown as Record<string, unknown>);
                        const stepPatch = Object.fromEntries(Object.entries(flatPatch).filter(([k]) => k.startsWith('step2.')));
                        saveDraft(stepPatch, progressPercent);
                    }}
                    isSaving={isSaving}
                    hasSaved={!!lastSavedAt}
                />
            </div>
            </fieldset>
        </form>
    );
}

export default function ApplicationStep2Page() {
    return (
        <Suspense fallback={
            <div className="flex flex-col items-center justify-center py-20 min-h-[50vh]">
                <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
                <p className="text-slate-500 font-medium animate-pulse">Loading...</p>
            </div>
        }>
            <Step2Content />
        </Suspense>
    );
}
