import { cn } from '@/lib/utils';
import { StepItemProps } from '@/types/marketing';

export function StepItem({ step, title, description, isCompleted }: StepItemProps) {
    return (
        <div className="flex flex-col items-center text-center">
            <div
                className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mb-4 shadow-lg border-4",
                    isCompleted
                        ? "bg-primary text-white border-white"
                        : "bg-white border-primary text-primary"
                )}
            >
                {step}
            </div>
            <h4 className="text-lg font-bold text-text-main mb-2">{title}</h4>
            <p className="text-sm text-text-muted">{description}</p>
        </div>
    );
}
