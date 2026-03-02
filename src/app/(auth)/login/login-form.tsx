'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { Mail, Eye, ArrowRight } from 'lucide-react';
import { loginAction } from '../actions';
import { useSearchParams } from 'next/navigation';

const initialState = { error: '' };

export function LoginForm() {
    const [state, formAction, isPending] = useActionState(loginAction, initialState);
    const searchParams = useSearchParams();
    const successMsg = searchParams.get('reset') === 'success' ? 'Password reset successfully. You can now log in.' : null;

    return (
        <form className="flex flex-col gap-5" action={formAction}>
            {successMsg && (
                <div className="p-3 text-sm text-green-700 bg-green-100 rounded-lg dark:bg-green-900/30 dark:text-green-400">
                    {successMsg}
                </div>
            )}
            {state?.error && (
                <div className="p-3 text-sm text-red-500 bg-red-50 rounded-lg dark:bg-red-900/30">
                    {state.error}
                </div>
            )}

            {/* Email Field */}
            <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="email">
                    Email Address
                </label>
                <div className="relative">
                    <input
                        className="w-full h-12 px-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                        id="email"
                        name="email"
                        placeholder="name@company.com"
                        type="email"
                        required
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
                        <Mail className="w-5 h-5" />
                    </div>
                </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="password">
                        Password
                    </label>
                    <Link className="text-sm font-medium text-primary hover:text-blue-700 transition-colors" href="/forgot-password">
                        Forgot password?
                    </Link>
                </div>
                <div className="relative">
                    <input
                        className="w-full h-12 px-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                        id="password"
                        name="password"
                        placeholder="••••••••"
                        type="password"
                        required
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

            {/* Submit Button */}
            <button
                className="mt-2 w-full h-12 bg-primary hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-sm hover:shadow flex items-center justify-center gap-2 group disabled:opacity-50"
                type="submit"
                disabled={isPending}
            >
                <span>{isPending ? 'Logging in...' : 'Log In'}</span>
                {!isPending && <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />}
            </button>
        </form>
    );
}
