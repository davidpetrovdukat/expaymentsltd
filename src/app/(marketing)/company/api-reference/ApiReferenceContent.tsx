'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Code, FlaskConical, Webhook, Terminal, Bug, Route, ArrowRight } from 'lucide-react';
import { HeroNetworkSvgDynamic } from '@/components/marketing/svg/HeroNetworkSvgDynamic';

const FEATURES = [
    { icon: Code, title: 'Modern REST API', description: 'Predictable endpoints and smart versioning for long-term stability.' },
    { icon: FlaskConical, title: 'Production-Ready Sandbox', description: 'A testing environment that behaves exactly like production.' },
    { icon: Webhook, title: 'Real-time Webhooks', description: 'Instant event notifications and detailed transaction logs.' },
    { icon: Terminal, title: 'Language Agnostic', description: 'Plug in any stack using standard HTTP requests.' },
    { icon: Bug, title: 'Clear Error Codes', description: 'Detailed responses to debug and resolve issues in seconds.' },
    { icon: Route, title: 'Flexible Routing', description: 'Full control over transaction logic directly via API.' },
] as const;

const AVATAR_IDS = [1, 2, 3, 4, 5];

export function ApiReferenceContent() {
    return (
        <main>
            {/* Hero — same background + animation as Home (mesh-gradient + HeroNetworkSvgDynamic) */}
            <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden mesh-gradient min-h-[90vh] flex items-center">
                <HeroNetworkSvgDynamic />
                <div className="max-w-[80rem] mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center relative z-10 w-full">
                    <motion.div
                        className="flex flex-col gap-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="inline-flex w-fit items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
                            <span className="relative flex h-2 w-2">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                            </span>
                            API v2.4 Now Live
                        </div>
                        <div className="flex flex-col gap-6">
                            <h1 className="text-5xl font-extrabold leading-[1.1] tracking-tight text-text-main md:text-6xl lg:text-7xl">
                                Build Fast. <br />
                                <span className="text-primary">Scale Globally.</span>
                            </h1>
                            <p className="max-w-xl text-lg leading-relaxed text-text-muted md:text-xl">
                                A developer-first API designed for seamless integration and high-performance payments. Integrate Ex-Payments into your stack in minutes, not weeks.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-4 pt-4">
                            <Button className="bg-primary hover:bg-blue-700 text-white text-base font-semibold py-6 px-8 rounded-full shadow-lg hover:shadow-glow transition-all duration-300 flex items-center gap-2" asChild>
                                <Link href="/application/step-1">
                                    Start Your Application
                                    <ArrowRight className="w-5 h-5" />
                                </Link>
                            </Button>
                            <Button variant="outline" className="bg-white hover:bg-gray-50 text-text-main border border-gray-200 text-base font-semibold py-6 px-8 rounded-full transition-all duration-300 flex items-center gap-2" asChild>
                                <Link href="/contact">
                                    Contact Technical Sales
                                    <ArrowRight className="w-5 h-5" />
                                </Link>
                            </Button>
                        </div>
                    </motion.div>

                    {/* Terminal */}
                    <motion.div
                    className="relative"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-tr from-primary/20 to-transparent blur-2xl" />
                    <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-[#1e1e2e] to-[#11111b] shadow-2xl">
                        <div className="flex items-center gap-2 border-b border-white/5 bg-white/5 px-4 py-3">
                            <div className="flex gap-1.5">
                                <span className="size-3 rounded-full bg-red-500/80" />
                                <span className="size-3 rounded-full bg-yellow-500/80" />
                                <span className="size-3 rounded-full bg-green-500/80" />
                            </div>
                            <div className="flex-1 text-center">
                                <span className="text-xs font-medium text-slate-500">Terminal — bash</span>
                            </div>
                        </div>
                        <div className="space-y-1 p-6 font-mono text-sm leading-relaxed">
                            {[
                                ['curl', '-X POST https://api.ex-payments.com/v1/charges'],
                                ['', '-u YOUR_API_KEY:'],
                                ['', '-d amount=2000'],
                                ['', '-d currency="usd"'],
                                ['', '-d source="tok_visa"'],
                                ['', '// Response'],
                                ['', '{'],
                                ['', '"id": "ch_3M6tFm2eZvKYlo2C1G1pYm1M",'],
                                ['', '"status": "succeeded",'],
                                ['', '"amount": 2000'],
                                ['', '}'],
                            ].map(([lead, rest], i) => (
                                <div key={i} className="flex gap-4">
                                    <span className="text-slate-600">{i + 1}</span>
                                    <p className={lead ? '' : 'pl-4'}>
                                        {lead && <span className="text-[#c678dd]">{lead}</span>}
                                        {rest && <span className="text-slate-400">{rest}</span>}
                                    </p>
                                </div>
                            ))}
                            <div className="mt-4 flex animate-pulse items-center">
                                <span className="mr-2 h-4 w-2 bg-primary" />
                            </div>
                        </div>
                    </div>
                </motion.div>
                </div>
            </section>

            {/* Core Features — same card hover as Home (shadow-hover, duration-300, -translate-y-1, icon scale) */}
            <section className="py-24 bg-background-subtle">
                <div className="max-w-[80rem] mx-auto px-6">
                    <div className="mb-16">
                        <h2 className="text-3xl font-bold tracking-tight text-text-main">Engineered for Developers</h2>
                        <div className="mt-2 h-1.5 w-20 rounded-full bg-primary" />
                    </div>
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {FEATURES.map((item, i) => (
                            <motion.div
                                key={item.title}
                                className="group bg-white dark:bg-slate-800/50 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-700 hover:shadow-hover transition-all duration-300 hover:-translate-y-1"
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: '-40px' }}
                                transition={{ duration: 0.4, delay: i * 0.06 }}
                            >
                                <div className="mb-6 flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-white">
                                    <item.icon className="h-6 w-6" />
                                </div>
                                <h3 className="mb-3 text-xl font-bold text-text-main">{item.title}</h3>
                                <p className="leading-relaxed text-text-muted">{item.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Developer Trust - no "Explore Documentation" */}
            <section className="mb-24 px-4 max-w-[80rem] mx-auto">
                <motion.div
                    className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 p-8 md:p-16 dark:bg-slate-950"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="absolute -right-20 -top-20 size-80 rounded-full bg-primary/20 blur-3xl" />
                    <div className="relative flex flex-col items-center justify-between gap-12 lg:flex-row">
                        <div className="max-w-2xl text-center lg:text-left">
                            <h2 className="text-3xl font-bold leading-tight text-white md:text-4xl">
                                No ticket queues. No &quot;waiting 3-5 days&quot;.
                            </h2>
                            <p className="mt-4 text-lg text-slate-400">
                                Just real tools, fast answers, and a team that speaks code. We&apos;ve built the payments infrastructure we wanted to use.
                            </p>
                        </div>
                        <div className="flex flex-col items-center gap-6 lg:items-end">
                            <div className="flex items-center gap-4">
                                <div className="flex -space-x-3">
                                    {AVATAR_IDS.map((id, i) => (
                                        <motion.span
                                            key={id}
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            whileInView={{ opacity: 1, scale: 1 }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 0.3, delay: i * 0.05 }}
                                            className="inline-block"
                                        >
                                            <Image
                                                src={`https://i.pravatar.cc/150?img=${id + 10}`}
                                                alt=""
                                                width={40}
                                                height={40}
                                                className="size-10 rounded-full border-2 border-slate-900 object-cover"
                                            />
                                        </motion.span>
                                    ))}
                                </div>
                                <span className="text-sm font-medium text-slate-500">Trusted by 2k+ developers</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* Bottom CTA — same button style as Home */}
            <section className="py-24 text-center bg-background-subtle">
                <motion.div
                    className="mx-auto max-w-2xl px-6"
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4 }}
                >
                    <h2 className="mb-8 text-4xl font-extrabold tracking-tight text-text-main">Ready to integrate?</h2>
                    <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                        <Button className="w-full sm:w-auto bg-primary hover:bg-blue-700 text-white text-base font-semibold py-6 px-8 rounded-full shadow-lg hover:shadow-glow transition-all duration-300 flex items-center justify-center gap-2" asChild>
                            <Link href="/application/step-1">Start Your Application</Link>
                        </Button>
                        <Button variant="outline" className="w-full sm:w-auto bg-white hover:bg-gray-50 text-text-main border border-gray-200 text-base font-semibold py-6 px-8 rounded-full transition-all duration-300" asChild>
                            <Link href="/contact">Contact Sales</Link>
                        </Button>
                    </div>
                    <p className="mt-8 text-sm text-text-muted">
                        Have questions?{' '}
                        <Link href="/contact" className="font-semibold text-primary underline underline-offset-4 hover:opacity-90 transition-opacity duration-300">
                            Talk to an integration engineer
                        </Link>
                    </p>
                </motion.div>
            </section>
        </main>
    );
}
