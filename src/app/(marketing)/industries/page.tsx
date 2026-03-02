import { Metadata } from 'next';
import { ShoppingCart, Dices, TrendingUp, Bitcoin, Heart, Pill, ArrowRight, Verified, ChevronDown, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Ex-Payments - Industries',
    description: 'Reliable Processing for Every Industry. Specialized payment expertise from E-commerce to complex high-risk verticals.',
};

export default function IndustriesPage() {
    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 flex flex-col min-h-screen overflow-x-hidden">
            <main className="flex-grow">
                {/* Hero Section */}
                <section className="px-4 py-20 lg:py-28 relative overflow-hidden">
                    {/* Abstract decorative background element */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1200px] h-[600px] opacity-30 pointer-events-none -z-10"
                        style={{ background: 'radial-gradient(circle at center, rgba(79, 70, 229, 0.2) 0%, transparent 70%)' }}></div>

                    <div className="max-w-[800px] mx-auto text-center flex flex-col gap-6 relative z-10">
                        <div className="inline-flex items-center justify-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium self-center mb-2">
                            <Verified className="h-4 w-4" />
                            <span>Compliance Experts</span>
                        </div>
                        <h1 className="text-slate-900 dark:text-white text-5xl md:text-6xl font-black leading-tight tracking-tight">
                            Reliable Processing for Every Industry
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400 text-lg md:text-xl font-normal leading-relaxed max-w-2xl mx-auto">
                            We understand that every sector has unique compliance nuances. Ex-Payments provides specialized
                            expertise to ensure your transactions remain uninterrupted, regardless of your risk profile.
                        </p>
                        <div className="mt-4 flex justify-center">
                            <ChevronDown className="h-10 w-10 text-slate-300 dark:text-slate-700 animate-bounce" />
                        </div>
                    </div>
                </section>

                {/* Industries Grid Section */}
                <section className="px-4 pb-24">
                    <div className="max-w-[1200px] mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                            {/* Card 1: E-commerce & Retail */}
                            <div className="group p-8 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-soft hover:shadow-hover transition-all duration-300 hover:-translate-y-1">
                                <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-6">
                                    <ShoppingCart className="h-7 w-7" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">E-commerce & Retail</h3>
                                <p className="text-sm font-semibold text-primary mb-3">Global Reach, Frictionless Conversion</p>
                                <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                                    Maximize your checkout success with a gateway optimized for speed and global acceptance.
                                </p>
                                <ul className="space-y-3">
                                    <li className="flex items-start gap-3 text-sm text-slate-500 dark:text-slate-400">
                                        <CheckCircle className="h-5 w-5 text-primary shrink-0" />
                                        <span><strong>High Acceptance:</strong> 190+ countries</span>
                                    </li>
                                    <li className="flex items-start gap-3 text-sm text-slate-500 dark:text-slate-400">
                                        <CheckCircle className="h-5 w-5 text-primary shrink-0" />
                                        <span><strong>Fast Settlements:</strong> Accelerated payout cycles</span>
                                    </li>
                                    <li className="flex items-start gap-3 text-sm text-slate-500 dark:text-slate-400">
                                        <CheckCircle className="h-5 w-5 text-primary shrink-0" />
                                        <span><strong>Optimized UX:</strong> Mobile-first checkout flows</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Card 2: iGaming & Casino */}
                            <div className="group p-8 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-soft hover:shadow-hover transition-all duration-300 hover:-translate-y-1">
                                <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-6">
                                    <Dices className="h-7 w-7" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">iGaming & Casino</h3>
                                <p className="text-sm font-semibold text-primary mb-3">High-Velocity Processing</p>
                                <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                                    Navigate the complexities of iGaming with proper MCC coding and instant payout capabilities.
                                </p>
                                <ul className="space-y-3">
                                    <li className="flex items-start gap-3 text-sm text-slate-500 dark:text-slate-400">
                                        <CheckCircle className="h-5 w-5 text-primary shrink-0" />
                                        <span><strong>Instant Payouts:</strong> Real-time winnings</span>
                                    </li>
                                    <li className="flex items-start gap-3 text-sm text-slate-500 dark:text-slate-400">
                                        <CheckCircle className="h-5 w-5 text-primary shrink-0" />
                                        <span><strong>Local Expertise:</strong> LatAm and Asia</span>
                                    </li>
                                    <li className="flex items-start gap-3 text-sm text-slate-500 dark:text-slate-400">
                                        <CheckCircle className="h-5 w-5 text-primary shrink-0" />
                                        <span><strong>Compliance-First:</strong> 6042/7995 coding</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Card 3: Forex & CFD */}
                            <div className="group p-8 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-soft hover:shadow-hover transition-all duration-300 hover:-translate-y-1">
                                <div className="w-12 h-12 rounded-xl bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center mb-6">
                                    <TrendingUp className="h-7 w-7" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Forex & CFD</h3>
                                <p className="text-sm font-semibold text-primary mb-3">Stability for High-Ticket Trading</p>
                                <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                                    Handle large-volume transactions with a failover system designed for the financial markets.
                                </p>
                                <ul className="space-y-3">
                                    <li className="flex items-start gap-3 text-sm text-slate-500 dark:text-slate-400">
                                        <CheckCircle className="h-5 w-5 text-primary shrink-0" />
                                        <span><strong>High-Ticket Processing:</strong> Robust infrastructure</span>
                                    </li>
                                    <li className="flex items-start gap-3 text-sm text-slate-500 dark:text-slate-400">
                                        <CheckCircle className="h-5 w-5 text-primary shrink-0" />
                                        <span><strong>Security:</strong> 3D Secure v2 Optimization</span>
                                    </li>
                                    <li className="flex items-start gap-3 text-sm text-slate-500 dark:text-slate-400">
                                        <CheckCircle className="h-5 w-5 text-primary shrink-0" />
                                        <span><strong>Protection:</strong> Chargeback Mitigation tools</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Card 4: Crypto & Blockchain */}
                            <div className="group p-8 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-soft hover:shadow-hover transition-all duration-300 hover:-translate-y-1">
                                <div className="w-12 h-12 rounded-xl bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 flex items-center justify-center mb-6">
                                    <Bitcoin className="h-7 w-7" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Crypto & Blockchain</h3>
                                <p className="text-sm font-semibold text-primary mb-3">Native Solutions for Web3</p>
                                <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                                    Seamlessly integrate Fiat-to-Crypto onramps into your platform or exchange.
                                </p>
                                <ul className="space-y-3">
                                    <li className="flex items-start gap-3 text-sm text-slate-500 dark:text-slate-400">
                                        <CheckCircle className="h-5 w-5 text-primary shrink-0" />
                                        <span><strong>Fiat Onramps:</strong> Cards & bank transfers</span>
                                    </li>
                                    <li className="flex items-start gap-3 text-sm text-slate-500 dark:text-slate-400">
                                        <CheckCircle className="h-5 w-5 text-primary shrink-0" />
                                        <span><strong>Structure:</strong> Web3 Friendly infrastructure</span>
                                    </li>
                                    <li className="flex items-start gap-3 text-sm text-slate-500 dark:text-slate-400">
                                        <CheckCircle className="h-5 w-5 text-primary shrink-0" />
                                        <span><strong>Standards:</strong> Global crypto-compliance</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Card 5: Dating & Social */}
                            <div className="group p-8 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-soft hover:shadow-hover transition-all duration-300 hover:-translate-y-1">
                                <div className="w-12 h-12 rounded-xl bg-pink-50 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 flex items-center justify-center mb-6">
                                    <Heart className="h-7 w-7" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Dating & Social</h3>
                                <p className="text-sm font-semibold text-primary mb-3">Optimized Recurring Billing</p>
                                <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                                    Ensure high retention for subscription-based models with intelligent recurring billing tools.
                                </p>
                                <ul className="space-y-3">
                                    <li className="flex items-start gap-3 text-sm text-slate-500 dark:text-slate-400">
                                        <CheckCircle className="h-5 w-5 text-primary shrink-0" />
                                        <span><strong>Discreet Billing:</strong> Protect user privacy</span>
                                    </li>
                                    <li className="flex items-start gap-3 text-sm text-slate-500 dark:text-slate-400">
                                        <CheckCircle className="h-5 w-5 text-primary shrink-0" />
                                        <span><strong>Subscription Logic:</strong> Automated retries</span>
                                    </li>
                                    <li className="flex items-start gap-3 text-sm text-slate-500 dark:text-slate-400">
                                        <CheckCircle className="h-5 w-5 text-primary shrink-0" />
                                        <span><strong>Growth:</strong> Global Scale memberships</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Card 6: Nutra & Pharma */}
                            <div className="group p-8 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-soft hover:shadow-hover transition-all duration-300 hover:-translate-y-1">
                                <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-6">
                                    <Pill className="h-7 w-7" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Nutra & Pharma</h3>
                                <p className="text-sm font-semibold text-primary mb-3">Continuity Billing for Wellness</p>
                                <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                                    Expertise in managing trial-to-subscription models and high-volume continuity billing.
                                </p>
                                <ul className="space-y-3">
                                    <li className="flex items-start gap-3 text-sm text-slate-500 dark:text-slate-400">
                                        <CheckCircle className="h-5 w-5 text-primary shrink-0" />
                                        <span><strong>Trial Management:</strong> Rebills optimization</span>
                                    </li>
                                    <li className="flex items-start gap-3 text-sm text-slate-500 dark:text-slate-400">
                                        <CheckCircle className="h-5 w-5 text-primary shrink-0" />
                                        <span><strong>Defense:</strong> Chargeback strategies</span>
                                    </li>
                                    <li className="flex items-start gap-3 text-sm text-slate-500 dark:text-slate-400">
                                        <CheckCircle className="h-5 w-5 text-primary shrink-0" />
                                        <span><strong>Reliability:</strong> Stable Acquiring</span>
                                    </li>
                                </ul>
                            </div>

                        </div>
                    </div>
                </section>

                {/* Final CTA Section */}
                <section className="py-24 px-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800">
                    <div className="max-w-3xl mx-auto text-center flex flex-col items-center gap-8">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
                            Ready for a solution tailored to your industry?
                        </h2>
                        <div className="flex flex-col items-center gap-4">
                            <Button size="lg" className="rounded-xl shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 gap-2 px-8 py-6 text-lg hover:-translate-y-0.5 transition-all" asChild>
                                <Link href="/sign-up">
                                    Get a Custom Quote
                                    <ArrowRight className="h-5 w-5" />
                                </Link>
                            </Button>
                            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                                Pre-approval response in 24 hours.
                            </p>
                        </div>
                    </div>
                </section>

            </main>
        </div>
    );
}
