'use client';

import { useActionState, useEffect, useState } from 'react';
import { Eye, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { resetPasswordAction } from '../actions';
import { createClient } from '@/lib/supabase/client';

const initialState = { error: '' };

export function ResetPasswordForm() {
    const [state, formAction, isPending] = useActionState(resetPasswordAction, initialState);
    const [isSessionChecking, setIsSessionChecking] = useState(true);
    const [hasSession, setHasSession] = useState(false);

    useEffect(() => {
        const checkSession = async () => {
            const supabase = createClient();
            const { data } = await supabase.auth.getSession();
            if (data.session) {
                setHasSession(true);
            } else {
                setHasSession(false);
            }
            setIsSessionChecking(false);
        };
        checkSession();
    }, []);

    if (isSessionChecking) {
        return <div className="text-center text-sm text-slate-500 py-6">Checking verification link...</div>;
    }

    if (!hasSession) {
        return (
            <div className="flex flex-col gap-4">
                <div className="p-4 text-sm text-amber-800 bg-amber-50 rounded-xl dark:bg-amber-900/40 dark:text-amber-300 text-center">
                    Your reset link is invalid or expired. Please request a new password reset email.
                </div>
                <Link
                    href="/forgot-password"
                    className="w-full h-12 bg-primary hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-sm hover:shadow flex items-center justify-center gap-2 group"
                >
                    Request new link
                </Link>
            </div>
        );
    }

    return (
        <form className="flex flex-col gap-5" action={formAction}>
            {state?.error && (
                <div className="p-3 text-sm text-red-500 bg-red-50 rounded-lg dark:bg-red-900/30">
                    {state.error}
                </div>
            )}

            <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="password">
                    Password
                </label>
                <div className="relative">
                    <input
                        className="w-full h-12 px-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                        id="password"
                        name="password"
                        placeholder="••••••••"
                        type="password"
                        required
                        minLength={8}
                    />
                    <button
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                        type="button"
                        onClick={(e) => {
                            const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                            input.type = input.type === 'password' ? 'text' : 'password';
                        }}
                    >
                        <Eye className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="confirm-password">
                    Confirm Password
                </label>
                <div className="relative">
                    <input
                        className="w-full h-12 px-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                        id="confirm-password"
                        name="confirm-password"
                        placeholder="••••••••"
                        type="password"
                        required
                        minLength={8}
                    />
                    <button
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                        type="button"
                        onClick={(e) => {
                            const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                            input.type = input.type === 'password' ? 'text' : 'password';
                        }}
                    >
                        <Eye className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <button
                className="mt-2 w-full h-12 bg-primary hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-sm hover:shadow flex items-center justify-center gap-2 group disabled:opacity-50"
                type="submit"
                disabled={isPending}
            >
                {isPending ? 'Resetting...' : 'Reset password'}
                {!isPending && <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />}
            </button>
        </form>
    );
}
