import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Server, Bitcoin, Wallet, ShieldCheck, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
    title: 'Ex-Payments - Solutions',
    description: 'Modular Financial Infrastructure for Global Scale',
};

export default function SolutionsPage() {
    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 flex flex-col min-h-screen">
            {/* Note: The Header (Navbar) and Footer are already handled by the (marketing) layout.tsx */}

            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative pt-24 pb-20 lg:pt-32 lg:pb-28 px-6 overflow-hidden">
                    <div className="max-w-4xl mx-auto text-center relative z-10">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1] mb-8">
                            Modular Financial Infrastructure for Global Scale
                        </h1>
                        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                            Deploy a stable, enterprise-grade payment ecosystem. From high-volume E-commerce to complex high-risk verticals, Ex-Payments provides the stability and scalability your business demands.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Button size="lg" className="rounded-full shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 gap-2 px-8 py-6 text-base" asChild>
                                <Link href="/sign-up">
                                    Start Your Application
                                    <ArrowRight className="h-5 w-5" />
                                </Link>
                            </Button>
                        </div>
                    </div>

                    {/* Background Gradients */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl -z-10 pointer-events-none opacity-40">
                        <div className="absolute top-[20%] left-[10%] w-64 h-64 bg-indigo-100/50 rounded-full blur-3xl mix-blend-multiply dark:mix-blend-screen"></div>
                        <div className="absolute top-[30%] right-[10%] w-72 h-72 bg-blue-100/50 rounded-full blur-3xl mix-blend-multiply dark:mix-blend-screen"></div>
                    </div>
                </section>

                {/* Solutions Grid */}
                <section className="py-20 px-6 bg-white dark:bg-background-dark relative">
                    <div className="max-w-6xl mx-auto space-y-8">

                        {/* Top 2 large cards */}
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="group bg-white dark:bg-slate-800 p-8 md:p-10 rounded-2xl shadow-card hover:shadow-hover border border-slate-100 dark:border-slate-700 transition-all duration-300 hover:-translate-y-1 cursor-default">
                                <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-900/20 text-primary group-hover:bg-primary group-hover:text-white rounded-xl flex items-center justify-center mb-8 transition-colors duration-300">
                                    {/* Replaced material icon with generic lucide placeholder based on semantic meaning */}
                                    <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8m0 0V3m0 10h9m-9 0H3" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Tailored Merchant Accounts</h3>
                                <p className="text-slate-600 dark:text-slate-400 mb-2 font-medium">Reliable Acquiring for Every Vertical.</p>
                                <p className="text-slate-500 dark:text-slate-400 leading-relaxed mb-8 text-sm">
                                    Access direct Merchant IDs (MIDs) through a global network of premier acquiring banks. We don&apos;t believe in one-size-fits-all; we match your specific business profile with the right banking partner to ensure long-term stability.
                                </p>
                                <ul className="space-y-3">
                                    <li className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-300">
                                        <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                                        Direct MIDs for enhanced control
                                    </li>
                                    <li className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-300">
                                        <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                                        Vertical-specific banking matching
                                    </li>
                                    <li className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-300">
                                        <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                                        Zero risk of sudden account freezes
                                    </li>
                                </ul>
                            </div>

                            <div className="group bg-white dark:bg-slate-800 p-8 md:p-10 rounded-2xl shadow-card hover:shadow-hover border border-slate-100 dark:border-slate-700 transition-all duration-300 hover:-translate-y-1 cursor-default">
                                <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-900/20 text-primary group-hover:bg-primary group-hover:text-white rounded-xl flex items-center justify-center mb-8 transition-colors duration-300">
                                    <Server className="h-7 w-7" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Enterprise Payment Gateway</h3>
                                <p className="text-slate-600 dark:text-slate-400 mb-2 font-medium">Intelligent Routing and High-Load Stability.</p>
                                <p className="text-slate-500 dark:text-slate-400 leading-relaxed mb-8 text-sm">
                                    Our gateway is engineered for 99.99% uptime. Utilize advanced transaction logic to maximize your conversion rates and ensure every legitimate payment is processed.
                                </p>
                                <ul className="space-y-3">
                                    <li className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-300">
                                        <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                                        Smart Routing & Cascading
                                    </li>
                                    <li className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-300">
                                        <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                                        Failover System
                                    </li>
                                    <li className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-300">
                                        <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                                        Seamless Integration via API
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Bottom 3 smaller cards */}
                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="group bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-card hover:shadow-hover border border-slate-100 dark:border-slate-700 transition-all duration-300 flex flex-col h-full hover:-translate-y-1 cursor-default">
                                <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/20 text-primary group-hover:bg-primary group-hover:text-white rounded-xl flex items-center justify-center mb-6 transition-colors duration-300">
                                    <Bitcoin className="h-6 w-6" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Crypto Processing</h3>
                                <p className="text-slate-600 dark:text-slate-400 mb-1 text-sm font-medium">Bridging Digital Assets and Fiat Stability.</p>
                                <p className="text-slate-500 dark:text-slate-400 leading-relaxed mb-6 text-sm flex-grow">
                                    Accept the world’s most popular cryptocurrencies without exposure to market volatility. Expand your reach to a global, tech-savvy audience.
                                </p>
                                <ul className="space-y-3 mt-auto pt-4 border-t border-slate-100 dark:border-slate-700">
                                    <li className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                                        <CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                                        Accept Top Assets (USDT, BTC, ETH)
                                    </li>
                                    <li className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                                        <CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                                        Instant Conversion to Fiat
                                    </li>
                                    <li className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                                        <CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                                        Zero Volatility Risk
                                    </li>
                                </ul>
                            </div>

                            <div className="group bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-card hover:shadow-hover border border-slate-100 dark:border-slate-700 transition-all duration-300 flex flex-col h-full hover:-translate-y-1 cursor-default">
                                <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/20 text-primary group-hover:bg-primary group-hover:text-white rounded-xl flex items-center justify-center mb-6 transition-colors duration-300">
                                    <Wallet className="h-6 w-6" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">B2B Wallets</h3>
                                <p className="text-slate-600 dark:text-slate-400 mb-1 text-sm font-medium">Unified Treasury Management.</p>
                                <p className="text-slate-500 dark:text-slate-400 leading-relaxed mb-6 text-sm flex-grow">
                                    Simplify international settlements with dedicated corporate wallets. Move funds across borders with the speed of local transfers.
                                </p>
                                <ul className="space-y-3 mt-auto pt-4 border-t border-slate-100 dark:border-slate-700">
                                    <li className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                                        <CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                                        Global Transfers (SWIFT/SEPA)
                                    </li>
                                    <li className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                                        <CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                                        Multi-Currency Management
                                    </li>
                                    <li className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                                        <CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                                        Streamlined Payouts
                                    </li>
                                </ul>
                            </div>

                            <div className="group bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-card hover:shadow-hover border border-slate-100 dark:border-slate-700 transition-all duration-300 flex flex-col h-full hover:-translate-y-1 cursor-default">
                                <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/20 text-primary group-hover:bg-primary group-hover:text-white rounded-xl flex items-center justify-center mb-6 transition-colors duration-300">
                                    <ShieldCheck className="h-6 w-6" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Fraud Prevention</h3>
                                <p className="text-slate-600 dark:text-slate-400 mb-1 text-sm font-medium">Precision Protection for Your Revenue.</p>
                                <p className="text-slate-500 dark:text-slate-400 leading-relaxed mb-6 text-sm flex-grow">
                                    Keep your chargeback ratio under 1% with our AI-driven security suite. We identify threats before they impact your bottom line.
                                </p>
                                <ul className="space-y-3 mt-auto pt-4 border-t border-slate-100 dark:border-slate-700">
                                    <li className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                                        <CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                                        AI-Driven Detection
                                    </li>
                                    <li className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                                        <CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                                        Pre-Dispute Alerts
                                    </li>
                                    <li className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                                        <CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                                        Customized Filters
                                    </li>
                                </ul>
                            </div>
                        </div>

                    </div>
                </section>

                {/* Bottom CTA */}
                <section className="py-24 px-6 bg-cta-bg dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-8 tracking-tight">
                            Ready to scale your payments?
                        </h2>
                        <div className="flex justify-center">
                            <Button size="lg" className="rounded-full shadow-xl shadow-indigo-500/20 hover:shadow-indigo-500/30 gap-2 px-10 py-6 text-lg" asChild>
                                <Link href="/sign-up">
                                    Start Your Application
                                    <ArrowRight className="h-5 w-5" />
                                </Link>
                            </Button>
                        </div>
                    </div>
                </section>

            </main>
        </div>
    );
}
