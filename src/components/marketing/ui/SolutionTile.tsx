import Link from 'next/link';
import { SolutionTileProps } from '@/types/marketing';
import { Icon } from '@/components/marketing/ui/Icon';

export function SolutionTile({ icon, title, description, href }: SolutionTileProps) {
    const content = (
        <>
            <Icon name={icon} className="w-8 h-8 text-primary mb-4 group-hover:scale-110 transition-transform block" />
            <h4 className="font-bold text-text-main mb-2">{title}</h4>
            <p className="text-sm text-text-muted">{description}</p>
        </>
    );

    const wrapperClasses = "p-6 rounded-2xl bg-gray-50 hover:bg-white border border-transparent hover:border-gray-200 hover:shadow-lg transition-all cursor-pointer group block";

    if (href) {
        return (
            <Link href={href} className={wrapperClasses}>
                {content}
            </Link>
        );
    }

    return <div className={wrapperClasses}>{content}</div>;
}
