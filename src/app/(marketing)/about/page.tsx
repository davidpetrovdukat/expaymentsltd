import { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck, Scale, Lock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
    title: 'Ex-Payments - About Us',
    description: 'Redefining the standard of global payments. Ex-Payments provides stable, borderless financial infrastructure for the modern digital economy.',
};

export default function AboutUsPage() {
    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 flex flex-col min-h-screen">
            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative isolate overflow-hidden pt-24 pb-16 sm:pt-32 sm:pb-24 lg:pt-40 lg:pb-32">
                    {/* Abstract decorative background element */}
                    <div aria-hidden="true" className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
                        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-10 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
                            style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}>
                        </div>
                    </div>

                    <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
                        <div className="mx-auto max-w-4xl">
                            <h1 className="font-display text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-6xl mb-8 leading-[1.1]">
                                Redefining the Standard of <span className="text-primary dark:text-indigo-400">Global Payments</span>
                            </h1>
                            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-400">
                                Our mission is to provide stable, borderless financial infrastructure for the businesses that drive the modern digital economy.
                            </p>
                        </div>
                    </div>

                    {/* Abstract decorative background element right */}
                    <div aria-hidden="true" className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]">
                        <div className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-10 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
                            style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}>
                        </div>
                    </div>
                </section>

                {/* The Story Section */}
                <section className="py-24 sm:py-32 bg-white dark:bg-background-dark">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                            <div className="lg:sticky lg:top-32">
                                <h2 className="text-base font-semibold leading-7 text-primary dark:text-indigo-400 mb-2">Bridging the Banking Gap</h2>
                                <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">The Ex-Payments Story</p>
                                <div className="mt-8 h-1 w-20 bg-primary/20 dark:bg-indigo-500/30 rounded-full"></div>
                            </div>
                            <div className="space-y-6 text-lg leading-relaxed text-slate-600 dark:text-slate-400">
                                <p>
                                    Traditional banking often struggles to keep pace with digital innovation. For high-growth global merchants, this gap creates unnecessary friction—delayed settlements, opaque compliance checks, and fragmented payment rails that stifle expansion.
                                </p>
                                <p>
                                    At Ex-Payments, we believe stability is not just a feature—it is the foundation of growth. We built our infrastructure from the ground up to solve the specific volatility issues that plague modern commerce.
                                </p>
                                <p className="font-medium text-slate-900 dark:text-slate-200">
                                    By providing transparent, high-approval processing, we empower merchants to scale without the fear of sudden interruptions. We don&apos;t just process payments; we secure the lifeline of your business.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* KPI Grid Section */}
                <section className="bg-slate-50 dark:bg-slate-900/50 py-24 sm:py-32 border-y border-slate-100 dark:border-slate-800">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                            {/* KPI 1 */}
                            <div className="flex flex-col gap-y-3 border-l-2 border-slate-200 dark:border-slate-700 pl-6 hover:border-primary dark:hover:border-indigo-400 transition-colors duration-300">
                                <dt className="text-base leading-7 text-slate-600 dark:text-slate-400">Supported Countries</dt>
                                <dd className="order-first text-4xl font-bold tracking-tight text-slate-900 dark:text-white">190+</dd>
                            </div>
                            {/* KPI 2 */}
                            <div className="flex flex-col gap-y-3 border-l-2 border-slate-200 dark:border-slate-700 pl-6 hover:border-primary dark:hover:border-indigo-400 transition-colors duration-300">
                                <dt className="text-base leading-7 text-slate-600 dark:text-slate-400">Txn Success Rate</dt>
                                <dd className="order-first text-4xl font-bold tracking-tight text-slate-900 dark:text-white">98%</dd>
                            </div>
                            {/* KPI 3 */}
                            <div className="flex flex-col gap-y-3 border-l-2 border-slate-200 dark:border-slate-700 pl-6 hover:border-primary dark:hover:border-indigo-400 transition-colors duration-300">
                                <dt className="text-base leading-7 text-slate-600 dark:text-slate-400">Expert Support</dt>
                                <dd className="order-first text-4xl font-bold tracking-tight text-slate-900 dark:text-white">24/7</dd>
                            </div>
                            {/* KPI 4 (Highlighted) */}
                            <div className="relative flex flex-col gap-y-3 rounded-2xl bg-white dark:bg-slate-800 p-6 shadow-card ring-1 ring-slate-900/5 dark:ring-white/10 lg:-my-6 lg:justify-center">
                                <div className="absolute -top-3 right-6 rounded-full bg-green-100 dark:bg-green-900/30 px-3 py-1 text-xs font-semibold text-green-700 dark:text-green-400 ring-1 ring-inset ring-green-600/20 dark:ring-green-500/20">
                                    Industry Leading
                                </div>
                                <dt className="text-base leading-7 text-slate-600 dark:text-slate-400">Sudden Account Freezes</dt>
                                <dd className="order-first text-4xl font-bold tracking-tight text-primary dark:text-indigo-400">0%</dd>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Security & Compliance Section */}
                <section className="py-24 sm:py-32 bg-white dark:bg-background-dark">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mx-auto max-w-2xl lg:text-center mb-16">
                            <h2 className="text-base font-semibold leading-7 text-primary dark:text-indigo-400">Safety First</h2>
                            <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">Bank-Grade Security as Standard</p>
                            <p className="mt-6 text-lg leading-8 text-slate-600 dark:text-slate-400">
                                Trust is earned through rigorous adherence to safety. We employ multi-layered protection to ensure every transaction is secure and compliant.
                            </p>
                        </div>
                        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
                            <div className="grid grid-cols-1 gap-x-8 gap-y-16 lg:grid-cols-3">
                                {/* Feature 1 */}
                                <div className="flex flex-col items-start p-6 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all duration-300 border border-transparent hover:border-slate-100 dark:hover:border-slate-700">
                                    <div className="rounded-lg bg-slate-100 dark:bg-slate-800 p-3 ring-1 ring-slate-900/5 dark:ring-white/10 mb-6">
                                        <ShieldCheck className="h-8 w-8 text-slate-700 dark:text-slate-300" />
                                    </div>
                                    <dt className="text-xl font-semibold leading-7 text-slate-900 dark:text-white">
                                        PCI DSS Level 1 Certified
                                    </dt>
                                    <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-slate-600 dark:text-slate-400">
                                        <p className="flex-auto">The highest industry standard for payment data security. We undergo rigorous annual audits to maintain this top-tier certification.</p>
                                    </dd>
                                </div>
                                {/* Feature 2 */}
                                <div className="flex flex-col items-start p-6 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all duration-300 border border-transparent hover:border-slate-100 dark:hover:border-slate-700">
                                    <div className="rounded-lg bg-slate-100 dark:bg-slate-800 p-3 ring-1 ring-slate-900/5 dark:ring-white/10 mb-6">
                                        <Scale className="h-8 w-8 text-slate-700 dark:text-slate-300" />
                                    </div>
                                    <dt className="text-xl font-semibold leading-7 text-slate-900 dark:text-white">
                                        AML/KYC Rigor
                                    </dt>
                                    <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-slate-600 dark:text-slate-400">
                                        <p className="flex-auto">Strict compliance with global anti-money laundering regulations ensuring a clean ecosystem for all our partners and merchants.</p>
                                    </dd>
                                </div>
                                {/* Feature 3 */}
                                <div className="flex flex-col items-start p-6 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all duration-300 border border-transparent hover:border-slate-100 dark:hover:border-slate-700">
                                    <div className="rounded-lg bg-slate-100 dark:bg-slate-800 p-3 ring-1 ring-slate-900/5 dark:ring-white/10 mb-6">
                                        <Lock className="h-8 w-8 text-slate-700 dark:text-slate-300" />
                                    </div>
                                    <dt className="text-xl font-semibold leading-7 text-slate-900 dark:text-white">
                                        Fraud Shield
                                    </dt>
                                    <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-slate-600 dark:text-slate-400">
                                        <p className="flex-auto">Advanced multi-layered encryption and real-time behavioral analysis for every transaction to stop threats before they happen.</p>
                                    </dd>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Final CTA Section */}
                <section className="relative isolate overflow-hidden bg-primary/5 dark:bg-indigo-900/10 px-6 py-24 sm:py-32 lg:px-8">
                    {/* Background image for texture (Optional styling left intact from raw) */}
                    <div className="absolute inset-0 -z-10 mix-blend-multiply dark:mix-blend-screen opacity-5 bg-center bg-cover"
                        data-alt="Abstract subtle geometric line pattern background texture"
                        style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuA_SAb6o6cFES2257i4SqF1euLM7B8BrYCQkyeyZ-OWTVKAiwMKDjlpdL8VOkvmJeeZtS3Qh3UVvtxmamWh5RrxZnFnTbTtKGeMAo6nS0e7iVIue8xnHsCLgREK9x0RrcfuwnuirBaE4uN6x138F5McEWB_ZlPPRnJMPswweTobgfTTgckOHUpVsG6zhJOkIKwb938lVF7LtN2m0A-r_ek44qKmkISqYWxiyv68_ft2jq107F9PtauwBVJF7C5AgPl3xmITK1OvBiA')" }}>
                    </div>
                    <div className="mx-auto max-w-2xl text-center">
                        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">Ready to scale with a stable partner?</h2>
                        <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-slate-600 dark:text-slate-400">
                            Join the hundreds of enterprise merchants who have switched to Ex-Payments for reliability and growth.
                        </p>
                        <div className="mt-10 flex items-center justify-center gap-x-6">
                            <Button size="lg" className="rounded-full shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 gap-2 px-8 py-6 text-base" asChild>
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
