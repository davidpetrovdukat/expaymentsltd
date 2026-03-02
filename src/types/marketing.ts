export interface FeatureCardProps {
    icon: string;
    iconBgClass: string;
    iconColorClass: string;
    title: string;
    description: string;
}

export interface SolutionTileProps {
    icon: string;
    title: string;
    description: string;
    href?: string;
}

export interface IndustryCardProps {
    variant: 'featured' | 'compact';
    icon: string;
    iconBgClass: string;
    iconColorClass: string;
    title: string;
    description: string;
    href?: string;
}

export interface StepItemProps {
    step: number;
    title: string;
    description: string;
    isCompleted: boolean;
}

export interface SectionHeaderProps {
    label?: string;
    title: string;
    subtitle?: string;
    ctaLabel?: string;
    ctaHref?: string;
    align?: 'left' | 'center';
}
