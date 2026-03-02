'use client';

import { useActionState } from 'react';
import { Mail, ArrowRight } from 'lucide-react';
import { forgotPasswordAction } from '../actions';

const initialState = { error: '' };

export function ForgotPasswordForm() {
    const [state, formAction, isPending] = useActionState(forgotPasswordAction, initialState);

    return (
        <form className="flex flex-col gap-6" action={formAction}>
            {state?.error && (
                <div className="p-3 text-sm text-red-500 bg-red-50 rounded-lg dark:bg-red-900/30">
                    {state.error}
                </div>
            )}

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

            <button
                className="w-full h-12 bg-primary hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-sm hover:shadow flex items-center justify-center gap-2 group disabled:opacity-50"
                type="submit"
                disabled={isPending}
            >
                {isPending ? 'Sending...' : 'Reset password'}
                {!isPending && <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />}
            </button>
        </form>
    );
}
