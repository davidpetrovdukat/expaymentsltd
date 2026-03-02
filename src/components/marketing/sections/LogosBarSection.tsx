import { CreditCard, Landmark, Banknote, Bitcoin, Euro } from 'lucide-react';

export function LogosBarSection() {
    return (
        <div className="border-y border-gray-100 bg-white relative z-10">
            <div className="max-w-[80rem] mx-auto px-6 py-8">
                <p className="text-center text-sm font-medium text-text-muted mb-6 uppercase tracking-widest">
                    Direct integrations with global financial networks:
                </p>
                <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                    <span className="text-2xl font-bold flex items-center gap-2">
                        <Banknote className="w-8 h-8" /> VISA
                    </span>
                    <span className="text-2xl font-bold flex items-center gap-2">
                        <CreditCard className="w-8 h-8" /> MasterCard
                    </span>
                    <span className="text-2xl font-bold flex items-center gap-2">
                        <Euro className="w-8 h-8" /> SEPA
                    </span>
                    <span className="text-2xl font-bold flex items-center gap-2">
                        <Landmark className="w-8 h-8" /> SWIFT
                    </span>
                    <span className="text-2xl font-bold flex items-center gap-2">
                        <Bitcoin className="w-8 h-8" /> Crypto
                    </span>
                </div>
            </div>
        </div>
    );
}
