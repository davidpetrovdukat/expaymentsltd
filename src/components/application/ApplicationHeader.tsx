import Link from 'next/link';
import Image from 'next/image';
import { HelpCircle, ArrowLeft } from 'lucide-react';

/** Application-specific top navigation bar with logo, help button, and avatar placeholder. */
export function ApplicationHeader() {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-4">
                    <Link
                        href="/dashboard"
                        className="flex items-center gap-1.5 text-sm font-medium text-text-secondary hover:text-primary transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        <span className="hidden sm:inline">Dashboard</span>
                    </Link>
                    <div className="h-6 w-px bg-slate-200" />
                    <Link href="/" className="shrink-0" aria-label="Ex-Payments home">
                        <Image
                            src="/logo.png"
                            alt="Ex-Payments"
                            width={168}
                            height={43}
                            className="h-11 w-auto max-h-11 object-contain"
                            unoptimized
                        />
                    </Link>
                </div>
                <div className="flex items-center gap-3">
                    <Link
                        href="/faq"
                        className="hidden sm:flex h-9 items-center justify-center rounded-full bg-slate-100 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-200 transition-colors"
                    >
                        <HelpCircle className="mr-2 h-4 w-4" />
                        Help Center
                    </Link>
                    <div className="h-8 w-8 overflow-hidden rounded-full bg-slate-200">
                        <div className="h-full w-full bg-gradient-to-br from-slate-300 to-slate-400" />
                    </div>
                </div>
            </div>
        </header>
    );
}

