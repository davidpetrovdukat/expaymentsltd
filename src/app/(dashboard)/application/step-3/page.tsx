'use client';

import { Suspense, useEffect, useRef } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useRouter, useSearchParams } from 'next/navigation';
import { StepProgress } from '@/components/application/StepProgress';
import { FormSection } from '@/components/application/FormSection';
import { StepActions } from '@/components/application/StepActions';
import { Loader2 } from 'lucide-react';
import { useDraft, flattenToDottedKeys } from '@/components/application/useDraft';
import { cn } from '@/lib/utils';

const FORECAST_ROWS = [
    { label: 'Transaction #', key: 'transaction_count' },
    { label: 'Total Volume', key: 'total_volume' },
    { label: 'Chargeback Amt', key: 'chargeback_amount' },
    { label: 'Chargeback Ratio', key: 'chargeback_ratio' }
] as const;

const FORECAST_COLS = [
    { label: 'Next Month', key: 'month_1' },
    { label: '+ 2 Months', key: 'month_2' },
    { label: '+ 3 Months', key: 'month_3' },
    { label: '+ 4 Months', key: 'month_4' },
    { label: '+ 5 Months', key: 'month_5' },
    { label: '+ 6 Months', key: 'month_6' },
] as const;

interface Step3FormData {
    'step3.target_markets': string[];
    'step3.processing_currencies': string[];
    'step3.settlement_currencies': string[];
    'step3.lowest_price': string;
    'step3.highest_price': string;
    'step3.avg_transaction_amount': string;
    'step3.monthly_turnover': string;
    'step3.avg_chargeback_count': string;
    'step3.avg_chargeback_volume': string;
    'step3.avg_chargeback_ratio': string;
    [key: `step3.forecast_${string}_${string}`]: string;
}

const R = { required: 'Required' } as const;

function Step3Content() {
    const currentStep = 3;
    const progressPercent = 40;
    const router = useRouter();
    const searchParams = useSearchParams();
    const viewMode = searchParams.get('mode') === 'view';
    const applicationId = searchParams.get('applicationId');
    const viewQuery = applicationId ? `?mode=view&applicationId=${applicationId}` : '';

    const { initialData, isLoading, isSaving, lastSavedAt, error, autoSave, saveDraft, isHydrated, status } = useDraft(currentStep);
    const skipNextSaveRef = useRef(false);

    const forecastDefaults: Record<string, string> = {};
    FORECAST_ROWS.forEach(row => {
        FORECAST_COLS.forEach(col => {
            forecastDefaults[`step3.forecast_${row.key}_${col.key}`] = '';
        });
    });

    const { register, control, reset, handleSubmit, formState: { errors } } = useForm<Step3FormData>({
        defaultValues: {
            'step3.target_markets': [],
            'step3.processing_currencies': [],
            'step3.settlement_currencies': [],
            'step3.lowest_price': '',
            'step3.highest_price': '',
            'step3.avg_transaction_amount': '',
            'step3.monthly_turnover': '',
            'step3.avg_chargeback_count': '',
            'step3.avg_chargeback_volume': '',
            'step3.avg_chargeback_ratio': '',
            ...forecastDefaults
        }
    });

    function getErr(name: string): string | undefined {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let obj: any = errors;
        for (const part of name.split('.')) obj = obj?.[part];
        return obj?.message;
    }

    useEffect(() => {
        if (isLoading) return;
        const step3Data = Object.keys(initialData)
            .filter(key => key.startsWith('step3.'))
            .reduce((acc, key) => {
                acc[key as keyof Step3FormData] = initialData[key] as never;
                return acc;
            }, {} as Partial<Step3FormData>);
        skipNextSaveRef.current = true;
        reset(step3Data);
    }, [isLoading, initialData, reset]);

    // useWatch is React Compiler-compatible; avoids the watch(callback) subscription pattern
    const autoSaveValues = useWatch({ control });
    useEffect(() => {
        if (!isHydrated) return;
        if (skipNextSaveRef.current) {
            skipNextSaveRef.current = false;
            return;
        }
        const flatPatch = flattenToDottedKeys(autoSaveValues as unknown as Record<string, unknown>);
        autoSave(flatPatch, progressPercent);
    }, [autoSaveValues, autoSave, progressPercent, isHydrated]);

    function handleNext() {
        if (status && status !== 'DRAFT') {
            router.push('/application/step-4');
            return;
        }
        handleSubmit(
            () => router.push('/application/step-4'),
            () => {}
        )();
    }

    const hasForecastErrors = FORECAST_ROWS.some(row =>
        FORECAST_COLS.some(col => getErr(`step3.forecast_${row.key}_${col.key}`))
    );

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
            <div className="mb-8 flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-black text-text-main tracking-tight mb-2">
                        Step 3: Processing Details
                    </h1>
                    <p className="text-text-secondary text-lg">
                        Please provide your processing history and future forecasts to help us calibrate your account.
                    </p>
                </div>
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

            <StepProgress currentStep={3} />

            <div className="bg-white rounded-xl shadow-lg border border-slate-100 p-6 md:p-10 mb-8">
                <FormSection title="Target Market &amp; Currencies" letter="A">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-12 border-b border-gray-100 pb-10">
                        <div>
                            <label className="block text-xs font-semibold text-text-secondary mb-3 uppercase tracking-wider">Target market</label>
                            <div className="space-y-3">
                                {['European Union (EU)', 'International'].map((market) => (
                                    <label key={market} className="flex items-center gap-3 cursor-pointer group">
                                        <input {...register('step3.target_markets')} value={market} className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer" type="checkbox" />
                                        <span className="text-text-main group-hover:text-primary transition-colors">{market}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-text-secondary mb-3 uppercase tracking-wider">Processing currency</label>
                            <div className="flex flex-col gap-3">
                                {['USD', 'EUR', 'GBP'].map((currency) => (
                                    <label key={currency} className="flex items-center gap-3 cursor-pointer group">
                                        <input {...register('step3.processing_currencies')} value={currency} className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer" type="checkbox" />
                                        <span className="text-text-main group-hover:text-primary transition-colors">{currency}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-text-secondary mb-3 uppercase tracking-wider">Settlement currency</label>
                            <div className="flex flex-col gap-3">
                                {['USD', 'EUR', 'GBP'].map((currency) => (
                                    <label key={`settle-${currency}`} className="flex items-center gap-3 cursor-pointer group">
                                        <input {...register('step3.settlement_currencies')} value={currency} className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer" type="checkbox" />
                                        <span className="text-text-main group-hover:text-primary transition-colors">{currency}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </FormSection>

                <FormSection title="Current Processing History" letter="B">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mb-12 border-b border-gray-100 pb-10">
                        <div className="space-y-6">
                            {[
                                { label: 'Lowest goods/services price', key: 'step3.lowest_price' as const },
                                { label: 'Highest goods/services price', key: 'step3.highest_price' as const },
                                { label: 'Current avg. amount of one transaction', key: 'step3.avg_transaction_amount' as const },
                                { label: 'Current monthly turnover', key: 'step3.monthly_turnover' as const },
                            ].map(({ label, key }) => (
                                <div key={label}>
                                    <label className="block text-sm font-medium text-text-main mb-2">{label}</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary">$</span>
                                        <input
                                            {...register(key)}
                                            className="w-full pl-8 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-text-main focus:ring-2 focus:ring-primary/20 focus:border-primary transition-shadow outline-none"
                                            placeholder="0.00"
                                            type="text"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-text-main mb-2">Avg. monthly number of chargebacks</label>
                                <input {...register('step3.avg_chargeback_count')} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-text-main focus:ring-2 focus:ring-primary/20 focus:border-primary transition-shadow outline-none" placeholder="0" type="number" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-main mb-2">Avg. monthly volume of chargebacks</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary">$</span>
                                    <input {...register('step3.avg_chargeback_volume')} className="w-full pl-8 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-text-main focus:ring-2 focus:ring-primary/20 focus:border-primary transition-shadow outline-none" placeholder="0.00" type="text" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-main mb-2">Avg. monthly chargeback ratio (%)</label>
                                <div className="relative">
                                    <input {...register('step3.avg_chargeback_ratio')} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-text-main focus:ring-2 focus:ring-primary/20 focus:border-primary transition-shadow outline-none" placeholder="0.0" type="text" />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary font-medium">%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </FormSection>

                <FormSection title="Merchant URL Forecast" letter="C">
                    {hasForecastErrors && (
                        <p className="text-red-500 text-sm mb-3 font-medium">All forecast fields are required. Please fill in all cells below.</p>
                    )}
                    <div className="overflow-x-auto -mx-4 md:mx-0 px-4 md:px-0">
                        <div className="min-w-[700px] border border-gray-200 rounded-lg overflow-hidden">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-text-secondary uppercase bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-4 font-semibold w-1/5 min-w-[160px]" scope="col">Metric</th>
                                        {FORECAST_COLS.map((col) => (
                                            <th key={col.key} className="px-3 py-4 font-semibold text-center" scope="col">{col.label}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-100">
                                    {FORECAST_ROWS.map((row) => (
                                        <tr key={row.key} className="hover:bg-gray-50">
                                            <th className="px-6 py-4 font-medium text-text-main whitespace-nowrap" scope="row">
                                                {row.label} <span className="text-red-500">*</span>
                                            </th>
                                            {FORECAST_COLS.map((col) => {
                                                const fieldKey = `step3.forecast_${row.key}_${col.key}` as keyof Step3FormData;
                                                const hasError = !!getErr(fieldKey);
                                                return (
                                                    <td key={fieldKey} className="px-2 py-3">
                                                        <input
                                                            {...register(fieldKey, R)}
                                                            className={cn(
                                                                'w-full text-center py-2 px-1 text-sm border-gray-200 rounded bg-transparent focus:border-primary focus:ring-0',
                                                                hasError && 'border-red-300 bg-red-50'
                                                            )}
                                                            placeholder={row.label === 'Chargeback Ratio' ? '%' : '-'}
                                                            type="text"
                                                        />
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </FormSection>
            </div>

            <StepActions
                nextLabel="Next Step: Directors & UBO"
                nextHref={viewMode && applicationId ? `/application/step-4${viewQuery}` : '/application/step-4'}
                prevHref={viewMode && applicationId ? `/application/step-2${viewQuery}` : '/application/step-2'}
                onBeforeNext={viewMode ? undefined : handleNext}
                onSaveDraft={viewMode ? undefined : () => {
                    const flatPatch = flattenToDottedKeys(autoSaveValues as unknown as Record<string, unknown>);
                    saveDraft(flatPatch, progressPercent);
                }}
                isSaving={isSaving}
                hasSaved={!!lastSavedAt}
            />
            </fieldset>
        </form>
    );
}

export default function ApplicationStep3Page() {
    return (
        <Suspense fallback={
            <div className="flex flex-col items-center justify-center py-20 min-h-[50vh]">
                <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
                <p className="text-slate-500 font-medium animate-pulse">Loading...</p>
            </div>
        }>
            <Step3Content />
        </Suspense>
    );
}
