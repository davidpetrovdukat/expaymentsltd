import Link from 'next/link';
import { SECURITY_FEATURES } from '@/lib/marketing-data';
import { ArrowRight } from 'lucide-react';

import { Icon } from '@/components/marketing/ui/Icon';
import { DataFlowSvgDynamic } from '@/components/marketing/svg/DataFlowSvgDynamic';

export function DeveloperSection() {
    return (
        <section className="py-24 bg-background-dark text-white overflow-hidden">
            <div className="max-w-[80rem] mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">

                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-blue-300 text-xs font-bold uppercase tracking-wider w-fit mb-6">
                        Developers First
                    </div>

                    <h2 className="text-3xl md:text-4xl font-bold mb-6">Bank-Grade Security & Infrastructure</h2>
                    <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                        Built on a modern technology stack that prioritizes security without compromising performance.
                    </p>

                    <div className="space-y-6">
                        {SECURITY_FEATURES.map((feature) => (
                            <div key={feature.title} className="flex gap-4 items-start">
                                <Icon name={feature.icon} className={`w-6 h-6 shrink-0 mt-1 ${feature.iconColor}`} />
                                <div>
                                    <h4 className="font-bold text-lg">{feature.title}</h4>
                                    <p className="text-gray-400 text-sm">{feature.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-10">
                        <Link href="/company/api-reference" className="text-blue-300 hover:text-white border-b border-gray-700 pb-1 hover:border-blue-400 inline-flex items-center gap-2 transition-colors">
                            API Reference <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>

                <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200 animate-pulse" />
                    <div className="relative bg-[#0d1117] rounded-2xl p-6 border border-gray-800 font-mono text-sm shadow-2xl z-10">

                        <DataFlowSvgDynamic />

                        <div className="flex items-center gap-2 mb-4 border-b border-gray-800 pb-4 relative z-20">
                            <div className="w-3 h-3 rounded-full bg-red-500" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500" />
                            <div className="w-3 h-3 rounded-full bg-green-500" />
                            <span className="ml-2 text-xs text-gray-500">process_payment.js</span>
                        </div>

                        <div className="text-gray-300 overflow-x-auto relative z-20">
                            <pre>
                                <code>
                                    <span className="text-purple-400">const</span> expay = <span className="text-blue-400">require</span>(<span className="text-green-400">&apos;ex-payments-node&apos;</span>);{'\n'}
                                    <span className="text-gray-500">{'// Initialize client'}</span>{'\n'}
                                    <span className="text-purple-400">const</span> client = <span className="text-purple-400">new</span> expay.Client({`{`}{'\n'}
                                    apiKey: <span className="text-green-400">&apos;pk_live_8e92...&apos;</span>{'\n'}
                                    {`}`});{'\n'}
                                    <span className="text-gray-500">{'// Create payment intent'}</span>{'\n'}
                                    <span className="text-purple-400">const</span> payment = <span className="text-purple-400">await</span> client.payments.create({`{`}{'\n'}
                                    amount: <span className="text-orange-400">25000</span>, <span className="text-gray-500">{'// $250.00'}</span>{'\n'}
                                    currency: <span className="text-green-400">&apos;USD&apos;</span>,{'\n'}
                                    payment_method: <span className="text-green-400">&apos;card&apos;</span>,{'\n'}
                                    risk_level: <span className="text-green-400">&apos;any&apos;</span>{'\n'}
                                    {`}`});{'\n'}
                                    console.<span className="text-blue-400">log</span>(payment.status);{'\n'}
                                    <span className="text-gray-500">{'// Output: \'succeeded\''}</span>
                                </code>
                            </pre>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}
