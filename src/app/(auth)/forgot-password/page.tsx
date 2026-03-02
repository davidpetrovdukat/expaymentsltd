import { Metadata } from 'next';
import Link from 'next/link';
import { KeyRound, ArrowLeft } from 'lucide-react';
import { ForgotPasswordForm } from './forgot-password-form';

export const metadata: Metadata = {
    title: 'Ex-Payments - Forgot Password',
    description: 'Reset your Ex-Payments password.',
};

export default function ForgotPasswordPage() {
    return (
        <div className="w-full max-w-[480px]">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-card w-full overflow-hidden border border-slate-100 dark:border-slate-700">
                <div className="p-8 md:p-12">
                    {/* Header Section */}
                    <div className="flex flex-col items-center text-center mb-8">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 text-primary">
                            <KeyRound className="w-6 h-6" />
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">
                            Forgot password?
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">
                            No worries, we&apos;ll send you reset instructions.
                        </p>
                    </div>

                    <ForgotPasswordForm />

                    {/* Back to Login */}
                    <div className="mt-8 text-center">
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
