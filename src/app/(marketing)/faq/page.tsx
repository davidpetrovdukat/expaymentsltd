import { Metadata } from 'next';
import Link from 'next/link';
import { Mail, Phone, ArrowRight, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
    title: 'Ex-Payments - FAQ',
    description: 'Everything you need to know about onboarding, pricing, and integration with Ex-Payments.',
};

export default function FAQPage() {
    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 flex flex-col min-h-screen">
            <main className="flex-grow px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
                <div className="max-w-3xl mx-auto space-y-12 shrink-0">

                    {/* Page Header */}
                    <div className="text-center space-y-4">
                        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                            Frequently Asked Questions
                        </h1>
                        <p className="text-lg text-slate-500 dark:text-slate-400 max-w-xl mx-auto font-medium">
                            Everything you need to know about onboarding, pricing, and integration.
                        </p>
                    </div>

                    {/* Accordion List */}
                    <div className="space-y-4">

                        {/* Row 1: Expanded by default */}
                        <details className="group bg-white dark:bg-slate-800 rounded-xl shadow-card overflow-hidden transition-all duration-300 hover:shadow-md" open>
                            <summary className="flex cursor-pointer items-center justify-between gap-4 p-6 select-none list-none [&::-webkit-details-marker]:hidden">
                                <span className="text-lg font-semibold text-slate-900 dark:text-white group-open:text-primary transition-colors">
                                    How long does the onboarding process take?
                                </span>
                                <div className="text-slate-400 group-hover:text-primary transition-colors flex-shrink-0 relative w-6 h-6">
                                    <Plus className="absolute inset-0 transition-opacity duration-300 group-open:opacity-0" />
                                    <Minus className="absolute inset-0 transition-opacity duration-300 opacity-0 group-open:opacity-100 text-primary" />
                                </div>
                            </summary>
                            <div className="px-6 pb-6 pt-0 animate-in slide-in-from-top-2 fade-in duration-300">
                                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-base">
                                    We prioritize speed without compromising compliance. We offer a 24-hour pre-approval SLA,
                                    giving you a decision on your application within one business day. Full integration and
                                    &quot;Go-Live&quot; typically occur within 2 to 5 business days.
                                </p>
                            </div>
                        </details>

                        {/* Row 2: Collapsed */}
                        <details className="group bg-white dark:bg-slate-800 rounded-xl shadow-card overflow-hidden transition-all duration-300 hover:shadow-md">
                            <summary className="flex cursor-pointer items-center justify-between gap-4 p-6 select-none list-none [&::-webkit-details-marker]:hidden">
                                <span className="text-lg font-semibold text-slate-900 dark:text-white group-open:text-primary transition-colors">
                                    What is your pricing structure?
                                </span>
                                <div className="text-slate-400 group-hover:text-primary transition-colors flex-shrink-0 relative w-6 h-6">
                                    <Plus className="absolute inset-0 transition-opacity duration-300 group-open:opacity-0" />
                                    <Minus className="absolute inset-0 transition-opacity duration-300 opacity-0 group-open:opacity-100 text-primary" />
                                </div>
                            </summary>
                            <div className="px-6 pb-6 pt-0 animate-in slide-in-from-top-2 fade-in duration-300">
                                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-base">
                                    Our pricing is transparent and tailored to your business model. We typically operate on a
                                    fixed percentage per transaction plus a small fixed fee. For high-volume merchants, we offer
                                    custom interchange-plus pricing models. Contact our sales team for a personalized quote.
                                </p>
                            </div>
                        </details>

                        {/* Row 3: Collapsed */}
                        <details className="group bg-white dark:bg-slate-800 rounded-xl shadow-card overflow-hidden transition-all duration-300 hover:shadow-md">
                            <summary className="flex cursor-pointer items-center justify-between gap-4 p-6 select-none list-none [&::-webkit-details-marker]:hidden">
                                <span className="text-lg font-semibold text-slate-900 dark:text-white group-open:text-primary transition-colors">
                                    Do you require a Rolling Reserve?
                                </span>
                                <div className="text-slate-400 group-hover:text-primary transition-colors flex-shrink-0 relative w-6 h-6">
                                    <Plus className="absolute inset-0 transition-opacity duration-300 group-open:opacity-0" />
                                    <Minus className="absolute inset-0 transition-opacity duration-300 opacity-0 group-open:opacity-100 text-primary" />
                                </div>
                            </summary>
                            <div className="px-6 pb-6 pt-0 animate-in slide-in-from-top-2 fade-in duration-300">
                                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-base">
                                    Rolling reserves are determined on a case-by-case basis depending on your business risk
                                    profile and processing history. While not mandatory for all merchants, they may be applied
                                    to high-risk verticals to ensure stable processing continuity.
                                </p>
                            </div>
                        </details>

                        {/* Row 4: Collapsed */}
                        <details className="group bg-white dark:bg-slate-800 rounded-xl shadow-card overflow-hidden transition-all duration-300 hover:shadow-md">
                            <summary className="flex cursor-pointer items-center justify-between gap-4 p-6 select-none list-none [&::-webkit-details-marker]:hidden">
                                <span className="text-lg font-semibold text-slate-900 dark:text-white group-open:text-primary transition-colors">
                                    Which geographies do you support?
                                </span>
                                <div className="text-slate-400 group-hover:text-primary transition-colors flex-shrink-0 relative w-6 h-6">
                                    <Plus className="absolute inset-0 transition-opacity duration-300 group-open:opacity-0" />
                                    <Minus className="absolute inset-0 transition-opacity duration-300 opacity-0 group-open:opacity-100 text-primary" />
                                </div>
                            </summary>
                            <div className="px-6 pb-6 pt-0 animate-in slide-in-from-top-2 fade-in duration-300">
                                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-base">
                                    We currently support merchants incorporated in the US, UK, EU, Canada, and Australia. We are
                                    rapidly expanding our global footprint to support businesses in APAC and LATAM regions by
                                    the end of this year.
                                </p>
                            </div>
                        </details>

                        {/* Row 5: Collapsed */}
                        <details className="group bg-white dark:bg-slate-800 rounded-xl shadow-card overflow-hidden transition-all duration-300 hover:shadow-md">
                            <summary className="flex cursor-pointer items-center justify-between gap-4 p-6 select-none list-none [&::-webkit-details-marker]:hidden">
                                <span className="text-lg font-semibold text-slate-900 dark:text-white group-open:text-primary transition-colors">
                                    How do I integrate Ex-Payments into my website?
                                </span>
                                <div className="text-slate-400 group-hover:text-primary transition-colors flex-shrink-0 relative w-6 h-6">
                                    <Plus className="absolute inset-0 transition-opacity duration-300 group-open:opacity-0" />
                                    <Minus className="absolute inset-0 transition-opacity duration-300 opacity-0 group-open:opacity-100 text-primary" />
                                </div>
                            </summary>
                            <div className="px-6 pb-6 pt-0 animate-in slide-in-from-top-2 fade-in duration-300">
                                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-base">
                                    Integration is simple with our robust REST API and pre-built SDKs for major platforms like
                                    Shopify, WooCommerce, and Magento. Our developer documentation provides comprehensive
                                    guides, and our technical support team is available to assist with custom implementations.
                                </p>
                            </div>
                        </details>

                    </div>

                    {/* Support Callout */}
                    <div className="mt-12 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 p-8 sm:p-10 text-center shadow-sm">
                        <div className="flex flex-col items-center gap-6">
                            <div className="space-y-2">
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Still have questions?</h3>
                                <p className="text-slate-500 dark:text-slate-400 text-base max-w-lg mx-auto">
                                    Our support team is available 24/7 via phone or email.
                                </p>
                            </div>

                            <Button size="lg" className="rounded-lg shadow-lg shadow-indigo-200 dark:shadow-none bg-[#3730a3] hover:bg-[#312e81] gap-2 px-8 py-6 text-base" asChild>
                                <Link href="/sign-up">
                                    Start Your Application
                                    <ArrowRight className="h-5 w-5" />
                                </Link>
                            </Button>

                            <div className="flex items-center justify-center gap-6 mt-2">
                                <a className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-primary transition-colors" href="mailto:info@ex-payments.com">
                                    <Mail className="h-5 w-5" />
                                    info@ex-payments.com
                                </a>
                                <a className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-primary transition-colors" href="tel:+17787444578">
                                    <Phone className="h-5 w-5" />
                                    +1 778 744 4578
                                </a>
                            </div>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}
