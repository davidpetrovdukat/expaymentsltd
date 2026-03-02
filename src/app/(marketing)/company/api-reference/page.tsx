import { Metadata } from 'next';
import { ApiReferenceContent } from './ApiReferenceContent';

export const metadata: Metadata = {
    title: 'Ex-Payments | Developer API Integration',
    description: 'Developer-first API for seamless integration and high-performance payments. Integrate Ex-Payments in minutes.',
};

export default function ApiReferencePage() {
    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen">
            <ApiReferenceContent />
        </div>
    );
}
