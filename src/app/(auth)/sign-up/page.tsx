import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Lock, ShieldCheck } from 'lucide-react';
import { SignUpForm } from './sign-up-form';

export const metadata: Metadata = {
    title: 'Ex-Payments - Sign Up',
    description: 'Start your application for a stable merchant account today.',
};

export default function SignUpPage() {
    return (
        <div className="w-full max-w-[480px]">
            {/* Header / Logo */}
            <div className="flex justify-center mb-8">
                <Link href="/" className="shrink-0 group transition-transform group-hover:scale-105" aria-label="Ex-Payments home">
                    <Image
                        src="/logo.png"
                        alt="Ex-Payments"
                        width={168}
                        height={43}
                        className="h-11 w-auto max-h-11 object-contain"
                        unoptimized
                    />
                </Link>
            </div>

            {/* Card */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-card w-full overflow-hidden border border-slate-100 dark:border-slate-700">
                <div className="p-8 md:p-10">
                    {/* Title & Subtitle */}
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-text-main dark:text-white mb-2 tracking-tight">
                            Create your account
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">
                            Start your application for a stable merchant account today.
                        </p>
                    </div>

                    {/* Form */}
                    <SignUpForm />
                </div>

                {/* Footer Area inside Card */}
                <div className="bg-slate-50 dark:bg-slate-900/50 px-8 py-4 border-t border-slate-100 dark:border-slate-700 text-center">
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Already have an account?{' '}
                        <Link href="/login" className="font-semibold text-primary hover:text-blue-700 transition-colors">
                            Log In
                        </Link>
                    </p>
                </div>
            </div>

            {/* Trust Indicator (Optional Decoration) */}
            <div className="mt-8 flex justify-center gap-6 opacity-40 grayscale">
                <div className="flex items-center gap-1">
                    <Lock className="w-4 h-4" />
                    <span className="text-xs font-medium text-text-main dark:text-white">SSL Secured</span>
                </div>
                <div className="flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4" />
                    <span className="text-xs font-medium text-text-main dark:text-white">Bank Grade Security</span>
                </div>
            </div>
        </div>
    );
}
