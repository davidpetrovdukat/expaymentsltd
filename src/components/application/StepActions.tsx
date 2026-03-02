'use client';

import Link from 'next/link';
import { ArrowRight, ArrowLeft, Save, FileSignature, Loader2, Check } from 'lucide-react';

interface StepActionsProps {
    nextLabel: string;
    nextHref?: string;
    prevHref?: string;
    variant?: 'default' | 'final';
    onSaveDraft?: () => void;
    isSaving?: boolean;
    hasSaved?: boolean;
    onSubmit?: () => void;
    isSubmitting?: boolean;
    /** When provided, the Next button validates before navigating. */
    onBeforeNext?: () => void;
}

export function StepActions({ nextLabel, nextHref, prevHref, variant = 'default', onSaveDraft, isSaving, hasSaved, onSubmit, isSubmitting, onBeforeNext }: StepActionsProps) {
    const isFinal = variant === 'final';

    const nextBtnClass = isFinal
        ? 'group flex w-full items-center justify-center rounded-full bg-emerald-500 px-8 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-200 transition-all hover:bg-emerald-600 hover:shadow-xl sm:w-auto'
        : 'group flex w-full items-center justify-center rounded-full bg-primary px-8 py-3 text-sm font-bold text-white shadow-md transition-all hover:bg-blue-700 hover:shadow-lg sm:w-auto';

    return (
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-slate-100 pt-8 sm:flex-row">
            <div className="flex w-full items-center gap-3 sm:w-auto">
                {prevHref && (
                    <Link
                        href={prevHref}
                        className="group flex w-full items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-text-main transition-all hover:bg-slate-50 hover:border-slate-300 sm:w-auto"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                        Back
                    </Link>
                )}
                <button
                    type="button"
                    onClick={onSaveDraft}
                    disabled={isSaving}
                    className="group flex w-full items-center justify-center rounded-full bg-slate-100 px-6 py-3 text-sm font-bold text-text-main transition-all hover:bg-slate-200 disabled:opacity-60 disabled:cursor-not-allowed sm:w-auto"
                >
                    {isSaving ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : hasSaved ? (
                        <Check className="mr-2 h-4 w-4 text-emerald-500" />
                    ) : (
                        <Save className="mr-2 h-4 w-4" />
                    )}
                    {isSaving ? 'Saving...' : hasSaved ? 'Saved!' : 'Save Draft'}
                </button>
            </div>
            {nextHref ? (
                onBeforeNext ? (
                    <button
                        type="button"
                        onClick={onBeforeNext}
                        className={nextBtnClass}
                    >
                        {isFinal && <FileSignature className="mr-2 h-4 w-4" />}
                        {nextLabel}
                        {!isFinal && <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />}
                    </button>
                ) : (
                    <Link href={nextHref} className={nextBtnClass}>
                        {isFinal && <FileSignature className="mr-2 h-4 w-4" />}
                        {nextLabel}
                        {!isFinal && <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />}
                    </Link>
                )
            ) : (
                <button
                    type="button"
                    onClick={onSubmit}
                    disabled={isSubmitting}
                    className="group flex w-full items-center justify-center rounded-full bg-emerald-500 px-8 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-200 transition-all hover:bg-emerald-600 hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed sm:w-auto"
                >
                    {isSubmitting ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <FileSignature className="mr-2 h-4 w-4" />
                    )}
                    {isSubmitting ? 'Submitting…' : nextLabel}
                </button>
            )}
        </div>
    );
}
