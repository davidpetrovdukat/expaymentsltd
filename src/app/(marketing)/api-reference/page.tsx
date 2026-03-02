import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Ex-Payments - API Reference',
    description: 'API Reference for Ex-Payments integration.',
};

export default function ApiReferencePage() {
    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 flex flex-col min-h-screen">
            <main className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6">API Reference</h1>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    API documentation will be available here. Content to be added.
                </p>
            </main>
        </div>
    );
}
