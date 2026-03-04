import { Metadata } from 'next';
import Link from 'next/link';
import {
    CheckCircle2,
    Fingerprint,
    Mail,
    Timer,
    Headset,
    ArrowRight,
    Download
} from 'lucide-react';

export const metadata: Metadata = {
    title: 'Ex-Payments - Application Submitted',
    description: 'Your merchant account application has been submitted successfully.',
};

type Props = { searchParams: Promise<{ applicationId?: string }> };

export default async function SubmissionSuccessPage({ searchParams }: Props) {
    const params = await searchParams;
    const applicationId = params.applicationId ?? null;

    return (
        <div className="bg-background-light dark:bg-slate-950 min-h-screen flex items-center justify-center p-4 antialiased text-slate-900 dark:text-slate-100 selection:bg-primary/20">
            <main className="w-full max-w-[640px] bg-white dark:bg-slate-900 rounded-2xl md:rounded-[24px] shadow-sm border border-slate-200 dark:border-slate-800 p-8 md:p-12 transition-all duration-300">
                {/* Icon Header */}
                <div className="flex justify-center mb-8">
                    <div className="h-20 w-20 md:h-24 md:w-24 bg-emerald-50 dark:bg-emerald-900/20 rounded-full flex items-center justify-center animate-bounce-soft">
                        <CheckCircle2 className="text-emerald-500 w-12 h-12 md:w-14 md:h-14" />
                    </div>
                </div>

                {/* Headings */}
                <div className="text-center space-y-4 mb-10">
                    <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
                        Application Successfully Submitted
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 text-base md:text-lg font-normal leading-relaxed max-w-lg mx-auto">
                        Thank you for choosing Ex-Payments. Your application has been sent to our onboarding team for review.
                    </p>
                </div>

                {/* Reference ID Box */}
                <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-10">
                    <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-5 py-3.5 rounded-2xl group transition-colors">
                        <Fingerprint className="text-slate-400 dark:text-slate-500 w-5 h-5 flex-shrink-0" />
                        <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
                            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Application ID:</span>
                            <span className="text-sm font-bold font-mono text-slate-900 dark:text-white tracking-wide">
                                {applicationId ?? '—'}
                            </span>
                        </div>
                        {/* Note: ID mocking is changed to indicate ungenerated backend ID for MVP purity */}
                        {/* <button className="ml-2 text-slate-400 hover:text-primary transition-colors focus:outline-none" title="Copy ID">
                            <Copy className="w-4 h-4" />
                        </button> */}
                    </div>
                </div>

                {/* Timeline / Checklist */}
                <div className="space-y-0 mb-10 relative">
                    {/* Connecting Line - hidden on very small screens, responsive left offset */}
                    <div className="absolute left-[27px] top-6 bottom-6 w-[2px] bg-slate-100 dark:bg-slate-800 -z-10 hidden sm:block"></div>

                    {/* Item 1: Email */}
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 pb-8 group text-center sm:text-left">
                        <div className="relative shrink-0 z-10">
                            <div className="h-14 w-14 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-full flex items-center justify-center shadow-sm group-hover:border-primary/30 group-hover:shadow-md transition-all duration-300">
                                <Mail className="text-primary w-6 h-6" />
                            </div>
                        </div>
                        <div className="pt-0 sm:pt-2">
                            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">Email Confirmation</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-sm">
                                We&apos;ve sent a copy of your application to your inbox.
                            </p>
                        </div>
                    </div>

                    {/* Item 2: Review */}
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 pb-8 group text-center sm:text-left">
                        <div className="relative shrink-0 z-10">
                            <div className="h-14 w-14 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-full flex items-center justify-center shadow-sm group-hover:border-primary/30 group-hover:shadow-md transition-all duration-300">
                                <Timer className="text-slate-400 dark:text-slate-500 w-6 h-6 group-hover:text-primary transition-colors" />
                            </div>
                        </div>
                        <div className="pt-0 sm:pt-2">
                            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">Review Period</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-sm">
                                Our experts will review your details within 24 hours.
                            </p>
                        </div>
                    </div>

                    {/* Item 3: Call */}
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 group text-center sm:text-left">
                        <div className="relative shrink-0 z-10">
                            <div className="h-14 w-14 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-full flex items-center justify-center shadow-sm group-hover:border-primary/30 group-hover:shadow-md transition-all duration-300">
                                <Headset className="text-slate-400 dark:text-slate-500 w-6 h-6 group-hover:text-primary transition-colors" />
                            </div>
                        </div>
                        <div className="pt-0 sm:pt-2">
                            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">Onboarding Call</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-sm">
                                A dedicated manager may reach out via Telegram or Email if further details are needed.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-3 sm:px-4">
                    <Link
                        href="/dashboard"
                        className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-blue-700 text-white h-14 rounded-full font-bold text-[15px] tracking-wide transition-all shadow-lg hover:shadow-xl transform active:scale-[0.98]"
                    >
                        <span>Go to Merchant Dashboard</span>
                        <ArrowRight className="w-5 h-5 font-bold" />
                    </Link>

                    {applicationId ? (
                        <a
                            href={`/api/application/pdf?applicationId=${encodeURIComponent(applicationId)}`}
                            className="w-full flex items-center justify-center gap-2 bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 h-14 rounded-full font-semibold text-[15px] transition-colors focus:outline-none no-underline"
                            download
                        >
                            <Download className="w-5 h-5" />
                            <span>Download Application PDF</span>
                        </a>
                    ) : (
                        <div className="w-full flex items-center justify-center gap-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 h-14 rounded-full font-semibold text-[15px]">
                            <Download className="w-5 h-5" />
                            <span>Download Application PDF</span>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
