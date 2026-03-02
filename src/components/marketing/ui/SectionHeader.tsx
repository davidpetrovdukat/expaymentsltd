import Link from 'next/link';
import { cn } from '@/lib/utils';
import { SectionHeaderProps } from '@/types/marketing';
import { ArrowRight } from 'lucide-react';

export function SectionHeader({ label, title, subtitle, ctaLabel, ctaHref, align = 'center' }: SectionHeaderProps) {
    return (
        <div className={cn("mb-16", align === 'center' ? 'text-center max-w-3xl mx-auto' : 'flex flex-col md:flex-row justify-between items-end gap-6')}>
            <div className={cn(align === 'left' && !ctaHref && 'max-w-2xl')}>
                {label && (
                    <div className={cn("inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-bold uppercase tracking-wider w-fit mb-6", align === 'center' ? 'mx-auto' : '')}>
                        {label}
                    </div>
                )}
                <h2 className="text-3xl md:text-4xl font-bold text-text-main mb-4">{title}</h2>
                {subtitle && (
                    <p className="text-text-muted text-lg">{subtitle}</p>
                )}
            </div>
            {ctaLabel && ctaHref && (
                <Link href={ctaHref} className="text-primary font-semibold flex items-center gap-1 hover:gap-2 transition-all">
                    {ctaLabel} <ArrowRight className="w-4 h-4" />
                </Link>
            )}
        </div>
    );
}
