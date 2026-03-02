import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { LoginForm } from './login-form';

import { Suspense } from 'react';

export const metadata: Metadata = {
    title: 'Ex-Payments - Login',
    description: 'Welcome back to Ex-Payments.',
};

export default function LoginPage() {
    return (
        <div className="w-full max-w-[480px]">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-card w-full overflow-hidden border border-slate-100 dark:border-slate-700 relative group/card">
                {/* Decorative subtle background gradient */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/40 via-primary to-primary/40"></div>

                <div className="p-8 md:p-12">
                    {/* Header Section */}
                    <div className="flex flex-col items-center mb-8">
                        <Link href="/" className="mb-4 shrink-0" aria-label="Ex-Payments home">
                            <Image
                                src="/logo.png"
                                alt="Ex-Payments"
                                width={168}
                                height={43}
                                className="h-11 w-auto max-h-11 object-contain"
                                unoptimized
                            />
                        </Link>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white text-center">
                            Welcome back
                        </h1>
                    </div>

                    <Suspense fallback={<div className="h-[212px] flex items-center justify-center text-slate-500">Loading form...</div>}>
                        <LoginForm />
                    </Suspense>

                    {/* Footer Section inside card */}
                    <div className="mt-8 text-center">
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Don&apos;t have an account?
                            <Link className="font-semibold text-primary hover:text-blue-700 transition-colors ml-1.5" href="/sign-up">
                                Sign Up
                            </Link>
                        </p>
                    </div>
                </div>
            </div>

            {/* Simple footer for context */}
            <div className="mt-8 text-center">
                <p className="text-xs text-slate-500 dark:text-slate-500">
                    © {new Date().getFullYear()} Ex-Payments Inc. Secure login.
                </p>
            </div>
        </div>
    );
}
