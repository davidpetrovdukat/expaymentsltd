'use client';

import { useState } from 'react';
import { ArrowRight, CheckCircle2, AlertCircle, Loader2, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Status = 'idle' | 'loading' | 'success' | 'error';

export function ContactForm() {
    const [status, setStatus] = useState<Status>('idle');
    const [errorMsg, setErrorMsg] = useState('');

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setStatus('loading');
        setErrorMsg('');

        const form = e.currentTarget;
        const data = {
            name: (form.elements.namedItem('name') as HTMLInputElement).value.trim(),
            email: (form.elements.namedItem('email') as HTMLInputElement).value.trim(),
            subject: (form.elements.namedItem('subject') as HTMLSelectElement).value,
            message: (form.elements.namedItem('message') as HTMLTextAreaElement).value.trim(),
            // honeypot — intentionally left blank by real users
            website: (form.elements.namedItem('website') as HTMLInputElement).value,
        };

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            const json = await res.json().catch(() => ({}));

            if (!res.ok) {
                setErrorMsg(
                    typeof json.error === 'string'
                        ? json.error
                        : 'Something went wrong. Please try again.'
                );
                setStatus('error');
                return;
            }

            setStatus('success');
            form.reset();
        } catch {
            setErrorMsg('Network error. Please check your connection and try again.');
            setStatus('error');
        }
    }

    if (status === 'success') {
        return (
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm dark:border dark:border-slate-700 p-8 md:p-12 flex flex-col items-center justify-center text-center gap-4 min-h-[320px]">
                <CheckCircle2 className="h-14 w-14 text-emerald-500" />
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Message Sent!</h3>
                <p className="text-slate-600 dark:text-slate-400 max-w-xs">
                    Thank you for reaching out. We aim to respond within 2 hours on business days.
                </p>
                <button
                    onClick={() => setStatus('idle')}
                    className="mt-2 text-sm text-primary underline underline-offset-2 hover:text-primary/80"
                >
                    Send another message
                </button>
            </div>
        );
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm dark:border dark:border-slate-700 p-6 md:p-8 space-y-6"
            noValidate
        >
            {/* Honeypot — hidden from real users, filled by bots */}
            <input
                name="website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="hidden"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-900 dark:text-slate-200" htmlFor="name">
                        Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        className="w-full h-12 px-4 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200 shadow-sm outline-none"
                        id="name"
                        name="name"
                        placeholder="John Doe"
                        type="text"
                        required
                        disabled={status === 'loading'}
                    />
                </div>
                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-900 dark:text-slate-200" htmlFor="email">
                        Email <span className="text-red-500">*</span>
                    </label>
                    <input
                        className="w-full h-12 px-4 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200 shadow-sm outline-none"
                        id="email"
                        name="email"
                        placeholder="john@company.com"
                        type="email"
                        required
                        disabled={status === 'loading'}
                    />
                </div>
            </div>

            <div className="space-y-2 relative">
                <label className="block text-sm font-semibold text-slate-900 dark:text-slate-200" htmlFor="subject">
                    Subject <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                    <select
                        className="w-full h-12 px-4 pr-10 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200 shadow-sm appearance-none outline-none"
                        id="subject"
                        name="subject"
                        defaultValue=""
                        required
                        disabled={status === 'loading'}
                    >
                        <option disabled value="">Select a subject...</option>
                        <option value="technical">Technical Support</option>
                        <option value="sales">Sales Inquiry</option>
                        <option value="billing">Billing Question</option>
                        <option value="other">Other</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                        <ChevronDown className="h-5 w-5" />
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-900 dark:text-slate-200" htmlFor="message">
                    Message <span className="text-red-500">*</span>
                </label>
                <textarea
                    className="w-full p-4 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200 shadow-sm resize-none outline-none"
                    id="message"
                    name="message"
                    placeholder="How can we help you today?"
                    rows={4}
                    required
                    disabled={status === 'loading'}
                />
            </div>

            {status === 'error' && (
                <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
                    <p className="text-sm text-red-700 dark:text-red-400">{errorMsg}</p>
                </div>
            )}

            <Button
                className="w-full md:w-auto h-12 px-8 gap-2 shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30"
                type="submit"
                disabled={status === 'loading'}
            >
                {status === 'loading' ? (
                    <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Sending…
                    </>
                ) : (
                    <>
                        Send Message
                        <ArrowRight className="h-5 w-5" />
                    </>
                )}
            </Button>
        </form>
    );
}
