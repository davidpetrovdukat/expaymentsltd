import { INDUSTRIES } from '@/lib/marketing-data';
import { IndustryCard } from '@/components/marketing/ui/IndustryCard';
import { SectionHeader } from '@/components/marketing/ui/SectionHeader';

export function IndustriesSection() {
    return (
        <section className="py-24 bg-white">
            <div className="max-w-[80rem] mx-auto px-6">
                <SectionHeader
                    title="We Work Where Others Won't"
                    subtitle="Specialized support for industries that traditional banks often overlook."
                />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
                    {INDUSTRIES.map((industry) => (
                        <IndustryCard key={industry.title} {...industry} />
                    ))}
                </div>
            </div>
        </section>
    );
}
