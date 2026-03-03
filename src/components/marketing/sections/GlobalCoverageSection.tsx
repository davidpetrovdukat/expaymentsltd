import { Globe, Languages, CircleDollarSign } from 'lucide-react';
import { WorldMapSvgDynamic } from '@/components/marketing/svg/WorldMapSvgDynamic';

export function GlobalCoverageSection() {
    return (
        <section className="py-24 bg-background-subtle relative overflow-hidden">
            <div className="max-w-[80rem] mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">

                {/* Single map render: map is ONLY inside SVG via WorldMapSvgDynamic (no CSS background-image of world-map.svg). */}
                <div className="relative min-h-[400px] w-full bg-slate-50 rounded-3xl overflow-hidden" aria-label="Stylized world map showing global connectivity nodes">
                    <div
                        className="absolute inset-0 opacity-20"
                        style={{ backgroundImage: 'radial-gradient(#cbd5e1 2px, transparent 2px)', backgroundSize: '20px 20px' }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="aspect-[2754/1398] w-full h-auto max-h-full relative">
                            <WorldMapSvgDynamic />
                        </div>
                    </div>
                    <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur rounded-xl p-4 shadow-soft border border-gray-100 z-10 w-fit">
                        <p className="text-2xl font-bold text-text-main">190+</p>
                        <p className="text-sm text-text-muted whitespace-nowrap">Countries Supported</p>
                    </div>
                </div>

                <div>
                    <h2 className="text-3xl font-bold text-text-main mb-6">Global Coverage with No Borders</h2>

                    <div className="space-y-6">
                        <div className="flex gap-4">
                            <div className="mt-1 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-primary shrink-0">
                                <Globe className="w-4 h-4" />
                            </div>
                            <div>
                                <h4 className="text-lg font-bold text-text-main">Expand Internationally</h4>
                                <p className="text-text-muted">Accept payments from customers in 190+ countries with local acquiring solutions.</p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="mt-1 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-primary shrink-0">
                                <CircleDollarSign className="w-4 h-4" />
                            </div>
                            <div>
                                <h4 className="text-lg font-bold text-text-main">Local Payment Methods</h4>
                                <p className="text-text-muted">Boost conversion by offering customers their preferred local payment methods (APMs).</p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="mt-1 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-primary shrink-0">
                                <Languages className="w-4 h-4" />
                            </div>
                            <div>
                                <h4 className="text-lg font-bold text-text-main">Multi-Language Checkout</h4>
                                <p className="text-text-muted">Checkout pages that automatically adapt to your customer&apos;s language and location.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
