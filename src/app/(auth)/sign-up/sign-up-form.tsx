'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { Eye, Info, ArrowRight } from 'lucide-react';
import { signUpAction } from '../actions';

const initialState = { error: '' };

export function SignUpForm() {
    const [state, formAction, isPending] = useActionState(signUpAction, initialState);

    return (
        <form className="space-y-5" action={formAction}>
            {state?.error && (
                <div className="p-3 text-sm text-red-500 bg-red-50 rounded-lg dark:bg-red-900/30">
                    {state.error}
                </div>
            )}

            {/* Full Name */}
            <div>
                <label className="block text-sm font-medium text-text-main dark:text-slate-200 mb-1.5" htmlFor="fullname">
                    Full Name
                </label>
                <input
                    className="w-full h-[46px] rounded-xl border-slate-200 bg-white dark:bg-slate-900 dark:border-slate-700 text-text-main dark:text-white px-4 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-slate-400"
                    id="fullname"
                    name="fullname"
                    placeholder="e.g. Jane Doe"
                    type="text"
                    required
                />
            </div>

            {/* Email Address */}
            <div>
                <label className="block text-sm font-medium text-text-main dark:text-slate-200 mb-1.5" htmlFor="email">
                    Email Address
                </label>
                <input
                    className="w-full h-[46px] rounded-xl border-slate-200 bg-white dark:bg-slate-900 dark:border-slate-700 text-text-main dark:text-white px-4 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-slate-400"
                    id="email"
                    name="email"
                    placeholder="name@company.com"
                    type="email"
                    required
                />
            </div>

            {/* Password */}
            <div>
                <label className="block text-sm font-medium text-text-main dark:text-slate-200 mb-1.5" htmlFor="password">
                    Password
                </label>
                <div className="relative group">
                    <input
                        className="w-full h-[46px] rounded-xl border-slate-200 bg-white dark:bg-slate-900 dark:border-slate-700 text-text-main dark:text-white px-4 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-slate-400"
                        id="password"
                        name="password"
                        placeholder="••••••••"
                        type="password"
                        required
                        minLength={8}
                    />
                    <button
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 focus:outline-none"
                        type="button"
                        onClick={(e) => {
                            const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                            input.type = input.type === 'password' ? 'text' : 'password';
                        }}
                    >
                        <Eye className="w-5 h-5" />
                    </button>
                </div>
                <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-500 flex items-center gap-1">
                    <Info className="w-3.5 h-3.5" />
                    Password must be at least 8 characters
                </p>
            </div>

            {/* Confirm Password */}
            <div>
                <label className="block text-sm font-medium text-text-main dark:text-slate-200 mb-1.5" htmlFor="confirm-password">
                    Confirm Password
                </label>
                <div className="relative">
                    <input
                        className="w-full h-[46px] rounded-xl border-slate-200 bg-white dark:bg-slate-900 dark:border-slate-700 text-text-main dark:text-white px-4 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-slate-400"
                        id="confirm-password"
                        name="confirm-password"
                        placeholder="••••••••"
                        type="password"
                        required
                        minLength={8}
                    />
                </div>
            </div>

            {/* Checkbox */}
            <div className="flex items-start pt-1">
                <div className="flex h-5 items-center">
                    <input
                        className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary dark:border-slate-600 dark:bg-slate-800"
                        id="terms"
                        name="terms"
                        type="checkbox"
                        required
                    />
                </div>
                <div className="ml-3 text-sm">
                    <label className="font-normal text-slate-500 dark:text-slate-400" htmlFor="terms">
                        I agree to the <Link href="/legal/terms-of-use" className="font-medium text-primary hover:underline focus:outline-none focus:underline">Terms of Use</Link> and <Link href="/legal/privacy-policy" className="font-medium text-primary hover:underline focus:outline-none focus:underline">Privacy Policy</Link>.
                    </label>
                </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
                <button
                    className="flex w-full justify-center items-center gap-2 rounded-xl bg-primary px-3 py-3 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-colors disabled:opacity-50"
                    type="submit"
                    disabled={isPending}
                >
                    {isPending ? 'Creating Account...' : 'Create Account'}
                    {!isPending && <ArrowRight className="w-4 h-4" />}
                </button>
            </div>
        </form>
    );
}
