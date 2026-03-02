import { Metadata } from 'next';
import Link from 'next/link';
import { Mail, Phone, MapPin, Info } from 'lucide-react';
import { ContactForm } from '@/components/marketing/ContactForm';

export const metadata: Metadata = {
    title: 'Ex-Payments - Contact Us',
    description: 'Get in touch with the Ex-Payments team 24/7 for technical support, sales inquiries, or general assistance.',
};

export default function ContactUsPage() {
    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 flex flex-col min-h-screen">
            <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 flex-grow flex flex-col justify-center">

                {/* Hero Section */}
                <div className="text-center max-w-3xl mx-auto mb-20 md:mb-24">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-6 leading-[1.1]">
                        We Are Here to Help 24/7
                    </h1>
                    <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 font-normal leading-relaxed">
                        Whether you are looking to scale your business or need technical assistance, our team of payment experts is ready to assist you.
                    </p>
                </div>

                {/* Contact Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-24">
                    {/* Card 1: General Inquiries */}
                    <div className="group bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-card hover:shadow-hover border border-slate-100 dark:border-slate-700 transition-all duration-300 flex flex-col items-start h-full">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                            <Mail className="h-6 w-6" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">General Inquiries</h3>
                        <div className="flex flex-col gap-2 mt-auto">
                            <a className="text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors text-sm font-medium" href="mailto:info@ex-payments.com">
                                info@ex-payments.com
                            </a>
                        </div>
                    </div>

                    {/* Card 2: Phone Support */}
                    <div className="group bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-card hover:shadow-hover border border-slate-100 dark:border-slate-700 transition-all duration-300 flex flex-col items-start h-full">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                            <Phone className="h-6 w-6" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">Phone Support</h3>
                        <div className="flex flex-col gap-2 mt-auto">
                            <a className="text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors text-sm font-medium" href="tel:+17787444578">
                                +1 778 744 4578
                            </a>
                            <span className="text-xs text-slate-400 dark:text-slate-500 font-normal">Direct support line</span>
                        </div>
                    </div>

                    {/* Card 3: Corporate Address */}
                    <div className="group bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-card hover:shadow-hover border border-slate-100 dark:border-slate-700 transition-all duration-300 flex flex-col items-start h-full">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                            <MapPin className="h-6 w-6" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">Corporate Address</h3>
                        <div className="flex flex-col gap-2 mt-auto">
                            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed">
                                2709b 43rd Avenue,<br />
                                Vernon, British Columbia,<br />
                                V1T 3L2, Canada
                            </p>
                        </div>
                    </div>
                </div>

                {/* Form Section */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">

                    {/* Left Column: Context */}
                    <div className="lg:col-span-5 flex flex-col gap-8">
                        <div className="space-y-4">
                            <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Send Us a Message</h2>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-base">
                                Have a question? Use the form to reach our support or sales team. We aim to respond within 2 hours during business days.
                            </p>
                        </div>

                        {/* Callout Box */}
                        <div className="bg-blue-50 dark:bg-slate-800/50 border border-blue-100 dark:border-slate-700 rounded-xl p-6 flex gap-4 items-start">
                            <Info className="h-6 w-6 text-primary mt-0.5 shrink-0" />
                            <div className="space-y-2">
                                <p className="text-sm font-semibold text-slate-900 dark:text-white">New Merchant Account?</p>
                                <p className="text-sm text-slate-600 dark:text-slate-400 leading-normal">
                                    Note: To apply for a new Merchant Account, please use our dedicated{' '}
                                    <Link href="/sign-up" className="text-primary hover:text-primary-dark underline decoration-primary/30 underline-offset-2 font-medium">
                                        Application Form
                                    </Link>{' '}
                                    for faster processing.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Interactive Form */}
                    <div className="lg:col-span-7">
                        <ContactForm />
                    </div>
                </div>
            </main>
        </div>
    );
}
