import { cn } from '@/lib/utils';

interface FormSectionProps {
    title: string;
    /** Optional letter badge (A, B, C...) shown before the title */
    letter?: string;
    /** Optional right-aligned badge label */
    badge?: string;
    children: React.ReactNode;
    className?: string;
}

/** Reusable form section card with title, optional letter icon, and optional badge. */
export function FormSection({ title, letter, badge, children, className }: FormSectionProps) {
    return (
        <section className={cn('space-y-6', className)}>
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                    {letter && (
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-sm">
                            {letter}
                        </span>
                    )}
                    <h3 className="text-lg font-semibold text-text-main">{title}</h3>
                </div>
                {badge && (
                    <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                        {badge}
                    </span>
                )}
            </div>
            {children}
        </section>
    );
}
