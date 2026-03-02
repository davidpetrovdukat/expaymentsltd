import { icons, LucideProps } from 'lucide-react';

export interface IconProps extends Omit<LucideProps, 'ref'> {
    name: string;
}

export function Icon({ name, ...props }: IconProps) {
    // Try to find the exact icon or a reasonable fallback
    let iconName = name
        .replace('check-circle2', 'CheckCircle2')
        .replace('check-circle', 'CheckCircle')
        .split('-')
        .map(part => part.charAt(0).toUpperCase() + part.slice(1))
        .join('') as keyof typeof icons;

    // Handle special cases and fallbacks where lucide names might differ slightly
    if (!icons[iconName]) {
        switch (name) {
            case 'globe2': iconName = 'Globe'; break;
            case 'shield-check': iconName = 'ShieldCheck'; break;
            case 'dice-5': iconName = 'Dices'; break;
            case 'pill': iconName = 'Pill'; break;
            case 'graduation-cap': iconName = 'GraduationCap'; break;
            case 'heart': iconName = 'Heart'; break;
            case 'bitcoin': iconName = 'Bitcoin'; break;
            case 'trending-up': iconName = 'TrendingUp'; break;
            case 'shopping-cart': iconName = 'ShoppingCart'; break;
            case 'terminal': iconName = 'Terminal'; break;
            case 'zap': iconName = 'Zap'; break;
            case 'code': iconName = 'Code'; break;
            case 'layers': iconName = 'Layers'; break;
            case 'store': iconName = 'Store'; break;
            case 'shopping-bag': iconName = 'ShoppingBag'; break;
            case 'cpu': iconName = 'Cpu'; break;
            case 'wallet': iconName = 'Wallet'; break;
            case 'rocket': iconName = 'Rocket'; break;
            case 'radar': iconName = 'Radar'; break;
            default: iconName = 'Circle'; // Fallback
        }
    }

    const LucideIcon = icons[iconName as keyof typeof icons] || icons['Circle'];

    return <LucideIcon {...props} />;
}
