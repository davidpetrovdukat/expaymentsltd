import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import {
    Search,
    Filter,
    FileText,
    Edit,
    Eye,
    Plus,
} from 'lucide-react';
import { getUserApplications, ApplicationDraftRow } from '@/server/application/draft';
import { AppLink } from '@/components/application/AppLink';

export const metadata: Metadata = {
    title: 'Ex-Payments - Client Dashboard',
    description: 'Manage your merchant account applications.',
};

export default async function DashboardPage() {
    // Note: getUserApplications handles auth internally and returns [] if not authenticated
    // This assumes they are authenticated by middleware/layout.
    const { applications } = await getUserApplications();

    return (
        <div className="bg-background-light dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen flex flex-col font-display antialiased">
            {/* Header */}
            <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo Area */}
                        <Link href="/" className="flex items-center shrink-0 group transition-transform group-hover:scale-105" aria-label="Ex-Payments home">
                            <Image
                                src="/logo.png"
                                alt="Ex-Payments"
                                width={168}
                                height={43}
                                className="h-11 w-auto max-h-11 object-contain"
                                unoptimized
                            />
                        </Link>

                        {/* User Area - MVP Placeholder elements */}
                        <div className="flex items-center gap-6">
                            <Link href="/auth/signout" className="flex items-center gap-2 text-slate-500 hover:text-red-500 transition-colors duration-200" title="Sign Out">
                                <span className="text-sm font-semibold hidden sm:inline">Logout</span>
                            </Link>
                            {/* Simple Avatar Placeholder */}
                            <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm ring-2 ring-white dark:ring-slate-800 shadow-sm">
                                U
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
                {/* Hero / Page Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                    <div className="space-y-2">
                        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                            Applications
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 text-base md:text-lg max-w-2xl">
                            Manage your merchant account applications and track their status in real-time.
                        </p>
                    </div>
                    <AppLink
                        href="/application/step-1"
                        clearId
                        className="flex items-center justify-center gap-2 bg-primary hover:bg-blue-700 text-white font-semibold py-2.5 px-5 rounded-xl shadow-sm hover:shadow transition-all duration-200 whitespace-nowrap w-full md:w-auto"
                    >
                        <Plus className="w-5 h-5" />
                        Create New Application
                    </AppLink>
                </div>

                {/* Filters / Search */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div className="relative w-full sm:max-w-xs">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="text-slate-400 w-5 h-5" />
                        </div>
                        <input
                            className="block w-full pl-10 pr-3 h-10 border border-slate-200 dark:border-slate-700 rounded-xl leading-5 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm shadow-sm transition-all"
                            placeholder="Search applications..."
                            type="text"
                        />
                    </div>
                    <div className="flex gap-2 self-end sm:self-auto">
                        <button className="p-2 h-10 w-10 flex items-center justify-center border border-slate-200 dark:border-slate-700 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 bg-white dark:bg-slate-900 transition-colors shadow-sm">
                            <Filter className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Application Cards List */}
                <div className="space-y-4">
                    {applications.length === 0 ? (
                        <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">No applications found</h3>
                            <p className="text-slate-500">You haven&apos;t started any applications yet.</p>
                            <Link
                                href="/application/step-1"
                                className="inline-flex items-center mt-6 text-primary hover:text-primary/80 font-medium"
                            >
                                Start your first application →
                            </Link>
                        </div>
                    ) : (
                        applications.map((app: ApplicationDraftRow) => (
                            <div key={app.id} className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-card border border-slate-200 dark:border-slate-800 transition-shadow duration-300 hover:border-slate-300 dark:hover:border-slate-700 group">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="flex items-start gap-4 md:gap-5 flex-1">
                                        <div className="hidden sm:flex items-center justify-center h-12 w-12 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 shrink-0 mt-1 border border-slate-200 dark:border-slate-700">
                                            <FileText className="w-6 h-6" />
                                        </div>
                                        <div className="flex flex-col gap-1.5 w-full">
                                            <div className="flex items-center gap-3 flex-wrap">
                                                <h3 className="text-base md:text-lg font-bold text-slate-900 dark:text-white">
                                                    Merchant Application
                                                </h3>
                                                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                                                    {app.status}
                                                </span>
                                                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                                                    {app.progress_percent}% Complete
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400 flex-wrap">
                                                <span className="font-mono text-xs md:text-sm">ID: {app.id.substring(0, 8)}</span>
                                                <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700 hidden sm:block"></span>
                                                <span className="text-xs md:text-sm">
                                                    Last updated: {new Date(app.updated_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-end gap-2 w-full md:w-auto border-t md:border-t-0 border-slate-100 dark:border-slate-800 pt-4 md:pt-0">
                                        {app.status !== 'DRAFT' ? (
                                            <AppLink
                                                href={`/application/step-1?mode=view&applicationId=${app.id}`}
                                                applicationId={app.id}
                                                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 h-10 text-sm font-medium text-white bg-slate-600 hover:bg-slate-500 rounded-lg transition-colors"
                                            >
                                                <Eye className="w-4 h-4" />
                                                View
                                            </AppLink>
                                        ) : (
                                            <AppLink
                                                href={`/application/step-${app.current_step || 1}`}
                                                applicationId={app.id}
                                                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 h-10 text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 rounded-lg transition-colors"
                                            >
                                                <Edit className="w-4 h-4" />
                                                {app.progress_percent > 0 ? 'Continue' : 'Start'}
                                            </AppLink>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Pagination / Footer Note */}
                <div className="mt-8 flex justify-center text-sm text-slate-500 dark:text-slate-500">
                    <p>Showing {applications.length} application{applications.length !== 1 ? 's' : ''}</p>
                </div>
            </main>
        </div>
    );
}
