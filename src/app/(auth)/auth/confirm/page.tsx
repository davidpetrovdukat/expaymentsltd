import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
    title: 'Ex-Payments - Email verification',
    description: 'Email verification result for Ex-Payments.',
};

type Props = {
    searchParams: Promise<{ status?: string; message?: string | string[] }>;
};

export default async function AuthConfirmPage({ searchParams }: Props) {
    const params = await searchParams;
    const isError = params.status === 'error';
    const rawMessage = params.message;
    const message = typeof rawMessage === 'string' ? rawMessage : Array.isArray(rawMessage) ? rawMessage[0] ?? '' : '';

    return (
        <div className="w-full max-w-[480px]">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-card w-full overflow-hidden border border-slate-100 dark:border-slate-700 relative group/card">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/40 via-primary to-primary/40"></div>

                <div className="p-8 md:p-12">
                    <div className="flex flex-col items-center mb-6">
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
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white text-center">
                            {isError ? 'Verification problem' : 'Email confirmed'}
                        </h1>
                    </div>

                    <div className="space-y-4 text-center">
                        {isError ? (
                            <>
                                <p className="text-slate-600 dark:text-slate-300">
                                    We couldn’t verify your email. The link may have expired or already been used.
                                </p>
                                {message && (
                                    <p className="text-sm text-slate-500 dark:text-slate-400 break-words" role="alert">
                                        {message}
                                    </p>
                                )}
                            </>
                        ) : (
                            <>
                                <p className="text-slate-600 dark:text-slate-300">
                                    Thanks, your email is confirmed. Your account is active.
                                </p>
                                {message && (
                                    <p className="text-sm text-slate-500 dark:text-slate-400 break-words">
                                        {message}
                                    </p>
                                )}
                            </>
                        )}
                    </div>

                    <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                        {isError ? (
                            <Link
                                href="/contact"
                                className="inline-flex justify-center items-center rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
                            >
                                Contact support
                            </Link>
                        ) : (
                            <Link
                                href="/login"
                                className="inline-flex justify-center items-center rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
                            >
                                Sign in
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
