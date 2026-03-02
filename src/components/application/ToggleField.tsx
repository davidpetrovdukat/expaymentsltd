'use client';

import { useCallback } from 'react';
import { cn } from '@/lib/utils';

interface ToggleFieldProps {
    label: string;
    /** Current toggle value (from watch()) */
    checked: boolean;
    /** Called when the toggle is clicked — receives the NEW value */
    onCheckedChange: (newChecked: boolean) => void;
    /** Dependent fields rendered when toggle is ON. Hidden when OFF. */
    children?: React.ReactNode;
}

/**
 * Toggle switch with conditional field visibility.
 * When toggled OFF, children are unmounted (which hides dependent fields).
 * 
 * The step page is responsible for:
 *   1) Setting the toggle value via setValue() in onCheckedChange
 *   2) Resetting dependent fields when toggled OFF
 */
export function ToggleField({ label, checked, onCheckedChange, children }: ToggleFieldProps) {
    const handleToggle = useCallback(() => {
        onCheckedChange(!checked);
    }, [checked, onCheckedChange]);

    return (
        <div className="space-y-4">
            <div className="flex items-start justify-between gap-4">
                <span className="text-sm font-medium text-slate-700 flex-1 pt-1">
                    {label}
                </span>
                <div className="relative inline-flex items-center">
                    <button
                        type="button"
                        role="switch"
                        aria-checked={checked}
                        onClick={handleToggle}
                        className={cn(
                            'relative inline-flex h-6 w-12 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2',
                            checked ? 'bg-primary' : 'bg-slate-300'
                        )}
                    >
                        <span
                            className={cn(
                                'pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white border-4 shadow-sm transition-transform duration-200 ease-in-out',
                                checked ? 'translate-x-6 border-primary' : 'translate-x-0 border-slate-300'
                            )}
                        />
                    </button>
                </div>
            </div>
            {/* Dependent fields: unmounted when toggle is OFF */}
            {checked && children && (
                <div className="pl-0 md:pl-4 border-l-2 border-primary/20 ml-1">
                    {children}
                </div>
            )}
        </div>
    );
}

