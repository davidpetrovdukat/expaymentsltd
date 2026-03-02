import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { HeroDashboardMock } from '@/components/marketing/ui/HeroDashboardMock';
import { HeroNetworkSvgDynamic } from '@/components/marketing/svg/HeroNetworkSvgDynamic';

export function HeroSection() {
    return (
        <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden mesh-gradient min-h-[90vh] flex items-center">
            <HeroNetworkSvgDynamic />

            <div className="max-w-[80rem] mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center relative z-10 w-full">
                <div className="flex flex-col gap-6 max-w-2xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider w-fit">
                        <CheckCircle2 className="w-4 h-4" />
                        Global Payment Processing
                    </div>

                    <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tight text-text-main leading-[1.1]">
                        Stable Global Processing for <span className="text-primary">Every Type</span> of Business
                    </h1>

                    <p className="text-lg text-text-muted max-w-lg leading-relaxed">
                        A complete financial infrastructure designed for all kinds of businesses, from low to high risk.
                        Global reach with 24/7 support.
                    </p>

                    <div className="flex flex-wrap gap-4 pt-4">
                        <Button className="bg-primary hover:bg-blue-700 text-white text-base font-semibold py-6 px-8 rounded-full shadow-lg hover:shadow-glow transition-all duration-300 flex items-center gap-2" asChild>
                            <Link href="/sign-up">
                                Open Account
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                        </Button>
                        <Button variant="outline" className="bg-white hover:bg-gray-50 text-text-main border border-gray-200 text-base font-semibold py-6 px-8 rounded-full transition-all duration-300" asChild>
                            <Link href="/contact">Contact Sales</Link>
                        </Button>
                    </div>

                    <div className="flex items-center gap-4 pt-4 text-sm text-text-muted">
                        <div className="flex -space-x-2">
                            {[11, 12, 13].map((id) => (
                                <Image
                                    key={id}
                                    src={`https://i.pravatar.cc/150?img=${id}`}
                                    alt=""
                                    width={32}
                                    height={32}
                                    className="w-8 h-8 rounded-full border-2 border-white object-cover"
                                />
                            ))}
                        </div>
                        <p>Trusted by 2,000+ businesses</p>
                    </div>
                </div>

                <HeroDashboardMock />
            </div>
        </section>
    );
}
