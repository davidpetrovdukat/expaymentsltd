import { cn } from '@/lib/utils';
import { FeatureCardProps } from '@/types/marketing';
import { Icon } from '@/components/marketing/ui/Icon'; // We need an Icon component to map lucide strings

export function FeatureCard({ icon, iconBgClass, iconColorClass, title, description }: FeatureCardProps) {
    return (
        <div className="group bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-hover transition-all duration-300">
            <div
                className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform",
                    iconBgClass,
                    iconColorClass
                )}
            >
                <Icon name={icon} className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-text-main mb-2">{title}</h3>
            <p className="text-text-muted leading-relaxed">{description}</p>
        </div>
    );
}
