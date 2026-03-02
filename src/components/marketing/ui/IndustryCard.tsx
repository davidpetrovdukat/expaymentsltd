import { cn } from '@/lib/utils';
import Link from 'next/link';
import { IndustryCardProps } from '@/types/marketing';
import { Icon } from '@/components/marketing/ui/Icon';
import { ArrowRight } from 'lucide-react';

export function IndustryCard({ variant, icon, iconBgClass, iconColorClass, title, description, href }: IndustryCardProps) {
    if (variant === 'featured') {
        return (
            <div className="lg:row-span-2 bg-blue-50 p-8 rounded-3xl flex flex-col justify-between group hover:shadow-lg transition-all border border-blue-100">
                <div>
                    <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-sm", iconBgClass, iconColorClass)}>
                        <Icon name={icon} className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-bold text-text-main mb-2">{title}</h3>
                    <p className="text-text-muted">{description}</p>
                </div>
                {href && (
                    <div className="mt-8">
                        <Link href={href} className="text-primary font-medium flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                            Learn more <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg transition-all flex items-start gap-4">
            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shrink-0", iconBgClass, iconColorClass)}>
                <Icon name={icon} className="w-6 h-6" />
            </div>
            <div>
                <h3 className="text-lg font-bold text-text-main">{title}</h3>
                <p className="text-sm text-text-muted mt-1">{description}</p>
            </div>
        </div>
    );
}
