import React from 'react';

interface PolicyPageLayoutProps {
    title: string;
    lastUpdated?: string;
    children: React.ReactNode;
}

/**
 * Reusable layout for legal/policy pages. Matches site container (max-w-7xl) and typography.
 */
export function PolicyPageLayout({ title, lastUpdated, children }: PolicyPageLayoutProps) {
    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 flex flex-col min-h-screen">
            <main className="w-full mx-auto max-w-7xl px-6 lg:px-8 py-16 md:py-24 flex-1">
                <article className="max-w-4xl mx-auto">
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">
                        {title}
                    </h1>
                    {lastUpdated && (
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-10">
                            Last updated: {lastUpdated}
                        </p>
                    )}
                    <div className="policy-content policy-prose">
                        {children}
                    </div>
                </article>
            </main>
        </div>
    );
}
