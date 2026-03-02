import { SOLUTIONS } from '@/lib/marketing-data';
import { SolutionTile } from '@/components/marketing/ui/SolutionTile';
import { SectionHeader } from '@/components/marketing/ui/SectionHeader';

export function SolutionsSection() {
    return (
        <section className="py-24 bg-white">
            <div className="max-w-[80rem] mx-auto px-6">
                <SectionHeader
                    align="left"
                    title="Tailored Solutions"
                    subtitle="Everything you need to scale your high-risk business."
                    ctaLabel="View all solutions"
                    ctaHref="/solutions"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {SOLUTIONS.map((solution) => (
                        <SolutionTile key={solution.title} {...solution} />
                    ))}
                </div>
            </div>
        </section>
    );
}
