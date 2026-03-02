"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const NAV_LINKS = [
    { name: 'Solutions', href: '/solutions' },
    { name: 'Industries', href: '/industries' },
    { name: 'Company', href: '/about' },
    { name: 'FAQ', href: '/faq' },
];

export function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header
            className={cn(
                'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
                isScrolled
                    ? 'bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm py-3'
                    : 'bg-transparent border-transparent py-5'
            )}
        >
            <div className="max-w-[80rem] mx-auto px-6 flex items-center justify-between">
                <div className="flex items-center gap-10">
                    <Link href="/" className="flex items-center shrink-0 group" aria-label="Ex-Payments home">
                        <Image
                            src="/logo.png"
                            alt="Ex-Payments"
                            width={202}
                            height={52}
                            className="h-[3.25rem] w-auto max-h-[3.25rem] object-contain object-left transition-transform group-hover:scale-105"
                            priority
                            unoptimized
                        />
                    </Link>

                    <nav className="hidden md:flex items-center gap-8">
                        {NAV_LINKS.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-sm font-medium text-text-muted hover:text-primary transition-colors"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </nav>
                </div>

                <div className="flex items-center gap-4">
                    <Link href="/login" className="hidden md:block text-sm font-medium text-text-main hover:text-primary transition-colors">
                        Sign In
                    </Link>
                    <Button variant="outline" className="hidden lg:flex border-gray-200 text-text-main hover:bg-gray-50 rounded-full h-10 px-5" asChild>
                        <Link href="/contact">Contact Sales</Link>
                    </Button>
                    <Button className="bg-primary hover:bg-blue-700 text-white rounded-full h-10 px-6 shadow-sm hover:shadow-glow transition-all" asChild>
                        <Link href="/sign-up">Open Account</Link>
                    </Button>
                </div>
            </div>
        </header>
    );
}
