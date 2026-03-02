import { Metadata } from 'next';
import { Navbar } from '@/components/marketing/layout/Navbar';
import { Footer } from '@/components/marketing/layout/Footer';

export const metadata: Metadata = {
    title: 'Ex-Payments - Authentication',
    description: 'Secure login and registration for Ex-Payments.',
};

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="bg-background-subtle dark:bg-background-dark font-display antialiased min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1 flex flex-col items-center justify-center pt-24 pb-10 px-4">
                {children}
            </main>
            <Footer />
        </div>
    );
}
