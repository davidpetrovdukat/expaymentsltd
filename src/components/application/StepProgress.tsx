interface StepProgressProps {
    currentStep: 1 | 2 | 3 | 4 | 5;
}

const STEP_LABELS: Record<number, string> = {
    1: 'Company & Contact',
    2: 'Business Details',
    3: 'Processing Profile',
    4: 'Directors & UBO',
    5: 'Declaration',
};

/** Displays "Step N of 5" label and a progress bar. */
export function StepProgress({ currentStep }: StepProgressProps) {
    const percentage = currentStep * 20;

    return (
        <div className="mb-8 flex flex-col gap-2">
            <div className="flex justify-between items-end mb-2">
                <span className="text-sm font-semibold text-primary uppercase tracking-wider">
                    Step {currentStep} of 5 — {STEP_LABELS[currentStep]}
                </span>
                <span className="text-sm font-medium text-text-secondary">
                    {percentage}% Completed
                </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
                <div
                    className="h-full bg-primary transition-all duration-500 ease-out"
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
}
