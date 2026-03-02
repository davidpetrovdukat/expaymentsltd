import { VALUE_PROPS } from '@/lib/marketing-data';
import { FeatureCard } from '@/components/marketing/ui/FeatureCard';
import { SectionHeader } from '@/components/marketing/ui/SectionHeader';

export function ValuePropsSection() {
    return (
        <section className="py-24 bg-background-subtle">
            <div className="max-w-[80rem] mx-auto px-6">
                <SectionHeader
                    title="Why Ex-Payments?"
                    subtitle="We understand the unique challenges of your industry. Our infrastructure is built to minimize friction and maximize approval."
                />

                <div className="grid md:grid-cols-2 gap-6">
                    {VALUE_PROPS.map((prop) => (
                        <FeatureCard key={prop.title} {...prop} />
                    ))}
                </div>
            </div>
        </section>
    );
}
