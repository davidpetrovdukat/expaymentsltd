import { Metadata } from 'next';
import Link from 'next/link';
import { Mail, ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Ex-Payments - Check Your Email',
    description: 'We have sent a verification link to your email.',
};

interface CheckEmailPageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function CheckEmailPage({ searchParams }: CheckEmailPageProps) {
    const params = await searchParams;
    const mode = params?.mode;

    const isRecovery = mode === 'recovery';
    const title = isRecovery ? 'Check your email for recovery link' : 'Check your email';
    const description = isRecovery
        ? 'We have sent a secure password reset link to your email address. Please click the link to choose a new password.'
        : 'We have sent a secure verification link to your email address. Please click the link to verify your account and continue.';

    return (
        <div className="w-full max-w-[480px]">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-card w-full overflow-hidden border border-slate-100 dark:border-slate-700">
                <div className="p-8 md:p-12 text-center">
                    {/* Icon */}
                    <div className="mx-auto w-16 h-16 rounded-full bg-indigo-50 dark:bg-primary/10 flex items-center justify-center mb-6 text-primary">
                        <Mail className="w-8 h-8" />
                    </div>

                    {/* Title & Description */}
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mb-3">
                        {title}
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mb-8 leading-relaxed">
                        {description}
                    </p>

                    {/* Resend Action */}
                    <div className="space-y-4">
                        <p className="text-sm text-slate-600 dark:text-slate-300">
                            Didn&apos;t receive the email?
                        </p>
                        <button
                            className="w-full h-12 bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-primary border border-slate-200 dark:border-slate-600 font-semibold rounded-xl transition-all duration-200 shadow-sm"
                            type="button"
                        >
                            Click to resend
                        </button>
                    </div>

                    {/* Back to Login */}
                    <div className="mt-8">
                        <Link
                            href="/login"
                            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-primary transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to log in
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
