import {
    FeatureCardProps,
    IndustryCardProps,
    SolutionTileProps,
    StepItemProps,
} from '@/types/marketing';

export const VALUE_PROPS: FeatureCardProps[] = [
    {
        icon: 'check-circle2',
        iconBgClass: 'bg-blue-50',
        iconColorClass: 'text-primary',
        title: 'High Approval Rate',
        description: 'Industry-leading approval rates for high-risk verticals thanks to our multi-bank redundancy network.',
    },
    {
        icon: 'rocket',
        iconBgClass: 'bg-purple-50',
        iconColorClass: 'text-purple-600',
        title: 'Quick Review & Onboarding',
        description: 'Fast-track your application with our AI-assisted underwriting process. Go live in days, not weeks.',
    },
    {
        icon: 'globe2',
        iconBgClass: 'bg-teal-50',
        iconColorClass: 'text-teal-600',
        title: 'Multicurrency & Flexibility',
        description: 'Accept payments in 150+ currencies and instantly settle in your preferred fiat or crypto currency.',
    },
    {
        icon: 'shield-check',
        iconBgClass: 'bg-orange-50',
        iconColorClass: 'text-orange-600',
        title: 'Chargeback Protection',
        description: 'Advanced tools and alerts to help you minimize chargebacks and win disputes effectively.',
    },
];

export const SOLUTIONS: SolutionTileProps[] = [
    {
        icon: 'store',
        title: 'Tailored Merchant Accounts',
        description: 'Direct MIDs for high-risk verticals with stable banking partners.',
        href: '#',
    },
    {
        icon: 'cpu',
        title: 'Payment Gateway',
        description: 'Robust API integration with smart routing and cascading.',
        href: '#',
    },
    {
        icon: 'bitcoin',
        title: 'Crypto Processing',
        description: 'Accept crypto payments with instant fiat settlement options.',
        href: '#',
    },
    {
        icon: 'wallet',
        title: 'B2B Wallets',
        description: 'Manage funds, pay suppliers, and handle mass payouts globally.',
        href: '#',
    },
];

export const INTEGRATIONS = [
    { name: 'Shopify', iconClass: 'text-green-600', icon: 'shopping-bag' },
    { name: 'WooCommerce', iconClass: 'text-purple-600', icon: 'store' },
    { name: 'Magento', iconClass: 'text-orange-600', icon: 'layers' },
    { name: 'OpenCart', iconClass: 'text-blue-400', icon: 'shopping-cart' },
    { name: 'Pay.On', iconClass: 'text-gray-700', icon: 'terminal' },
    { name: 'QuickPay', iconClass: 'text-green-500', icon: 'zap' },
    { name: 'Custom API', iconClass: 'text-primary', icon: 'code' },
];

export const INDUSTRIES: IndustryCardProps[] = [
    {
        variant: 'featured',
        icon: 'shopping-cart',
        iconBgClass: 'bg-white',
        iconColorClass: 'text-primary',
        title: 'E-commerce & Retail',
        description: 'Complete payment solutions for high-volume online stores and retail marketplaces.',
    },
    {
        variant: 'compact',
        icon: 'dice-5',
        iconBgClass: 'bg-purple-50',
        iconColorClass: 'text-purple-600',
        title: 'iGaming & Casino',
        description: 'Reliable deposits and payouts.',
    },
    {
        variant: 'compact',
        icon: 'trending-up',
        iconBgClass: 'bg-green-50',
        iconColorClass: 'text-green-600',
        title: 'Forex & CFD',
        description: 'Seamless trading transactions.',
    },
    {
        variant: 'compact',
        icon: 'bitcoin',
        iconBgClass: 'bg-orange-50',
        iconColorClass: 'text-orange-600',
        title: 'Crypto & Blockchain',
        description: 'Fiat on/off ramps and exchanges.',
    },
    {
        variant: 'compact',
        icon: 'heart',
        iconBgClass: 'bg-pink-50',
        iconColorClass: 'text-pink-600',
        title: 'Dating & Social',
        description: 'Subscription management.',
    },
    {
        variant: 'compact',
        icon: 'pill',
        iconBgClass: 'bg-yellow-50',
        iconColorClass: 'text-yellow-600',
        title: 'Nutra & Pharma',
        description: 'Compliant processing solutions.',
    },
    {
        variant: 'compact',
        icon: 'graduation-cap',
        iconBgClass: 'bg-indigo-50',
        iconColorClass: 'text-indigo-600',
        title: 'Info-business',
        description: 'High-ticket coaching & courses.',
    },
];

export const HOW_IT_WORKS_STEPS: StepItemProps[] = [
    {
        step: 1,
        title: 'Application',
        description: 'Fill out our quick online form with your basic business details.',
        isCompleted: true,
    },
    {
        step: 2,
        title: 'Compliance',
        description: 'Our team reviews your documents for fast approval.',
        isCompleted: true,
    },
    {
        step: 3,
        title: 'Integration',
        description: 'Connect via API or plugin with our developer-friendly docs.',
        isCompleted: true,
    },
    {
        step: 4,
        title: 'Go Live',
        description: 'Start accepting payments securely and globally.',
        isCompleted: false, // Visual distinction for the last step based on HTML structure
    },
];

export const SECURITY_FEATURES = [
    {
        icon: 'shield-check',
        iconColor: 'text-green-400',
        title: 'PCI DSS Level 1 Compliant',
        description: 'The highest standard of security for payment processing.',
    },
    {
        icon: 'radar',
        iconColor: 'text-blue-400',
        title: 'Anti-Fraud System',
        description: 'Machine learning algorithms detect and block suspicious activities.',
    },
    {
        icon: 'code',
        iconColor: 'text-purple-400',
        title: 'Developer Friendly API',
        description: 'Stay updated on payment statuses instantly via secure webhooks and easy integration.',
    },
];
