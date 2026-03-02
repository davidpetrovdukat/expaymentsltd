import Link from 'next/link';
import Image from 'next/image';
import { Building2, Hash, Phone, Mail, MapPin } from 'lucide-react';

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-background-dark pt-20 pb-10 border-t border-gray-800 text-gray-300">
            <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">
                <div className="grid w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-10 mb-16 items-start min-w-0">
                    <div className="min-w-0">
                        <Link href="/" className="flex items-center mb-6 group inline-flex shrink-0" aria-label="Ex-Payments home">
                            <Image
                                src="/logo.png"
                                alt="Ex-Payments"
                                width={202}
                                height={52}
                                className="h-[3.25rem] w-auto max-h-[3.25rem] object-contain object-left transition-transform group-hover:scale-105"
                                unoptimized
                            />
                        </Link>
                        <p className="text-sm text-gray-400 max-w-xs mb-6 leading-relaxed">
                            Global payment processing infrastructure tailored for ambitious businesses. Fast onboarding, high approval rates, and 24/7 support.
                        </p>
                    </div>

                    <div className="min-w-0">
                        <h4 className="font-semibold text-white mb-4">Company</h4>
                        <ul className="space-y-3 text-sm flex flex-col">
                            <li><Link href="/solutions" className="hover:text-primary transition-colors">Solutions</Link></li>
                            <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
                            <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
                            <li><Link href="/company/api-reference" className="hover:text-primary transition-colors">API Reference</Link></li>
                        </ul>
                    </div>

                    <div className="min-w-0">
                        <h4 className="font-semibold text-white mb-4">Legal</h4>
                        <ul className="space-y-3 text-sm flex flex-col">
                            <li><Link href="/legal/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/legal/terms-of-use" className="hover:text-primary transition-colors">Terms of Use</Link></li>
                            <li><Link href="/legal/corporate-governance-process" className="hover:text-primary transition-colors">Corporate Governance Process</Link></li>
                            <li><Link href="/legal/refund-policy" className="hover:text-primary transition-colors">Refund Policy</Link></li>
                            <li><Link href="/legal/kyc-policy" className="hover:text-primary transition-colors">KYC Policy</Link></li>
                        </ul>
                    </div>

                    <div className="min-w-0">
                        <h4 className="font-semibold text-white mb-4">Company details</h4>
                        <ul className="space-y-3 text-sm text-gray-400 flex flex-col">
                            <li className="flex items-start gap-3">
                                <Building2 className="w-4 h-4 shrink-0 mt-0.5 text-gray-500" aria-hidden />
                                <span>Ex Payments Ltd</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Hash className="w-4 h-4 shrink-0 mt-0.5 text-gray-500" aria-hidden />
                                <span>BC1517261</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Phone className="w-4 h-4 shrink-0 mt-0.5 text-gray-500" aria-hidden />
                                <a href="tel:+17787444578" className="hover:text-primary transition-colors">+1 778 744 4578</a>
                            </li>
                            <li className="flex items-start gap-3">
                                <Mail className="w-4 h-4 shrink-0 mt-0.5 text-gray-500" aria-hidden />
                                <a href="mailto:info@ex-payments.com" className="hover:text-primary transition-colors">info@ex-payments.com</a>
                            </li>
                            <li className="flex items-start gap-3">
                                <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-gray-500" aria-hidden />
                                <span>2709b 43rd Avenue, Vernon, British Columbia, V1T 3L2, Canada</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-8 text-center text-xs text-gray-500">
                    <p>© {currentYear} Ex-Payments Ltd. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
