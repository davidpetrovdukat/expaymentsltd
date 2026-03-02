import { ApplicationHeader } from '@/components/application/ApplicationHeader';

/** Application form layout: shared header across all 5 application steps. */
export default function ApplicationLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen flex flex-col bg-background-light font-display antialiased text-text-main">
            <ApplicationHeader />
            <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-4xl">
                    {children}
                </div>
            </main>
        </div>
    );
}
