import { HOW_IT_WORKS_STEPS } from '@/lib/marketing-data';
import { StepItem } from '@/components/marketing/ui/StepItem';

export function HowItWorksSection() {
    return (
        <section className="py-24 bg-white">
            <div className="max-w-[80rem] mx-auto px-6">
                <h2 className="text-3xl font-bold text-center text-text-main mb-16">Simple Onboarding Process</h2>

                <div className="relative">
                    <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-gray-200 -translate-y-1/2 -z-10" />
                    <div className="hidden md:block absolute top-1/2 left-0 w-3/4 h-1 bg-primary -translate-y-1/2 -z-10" />

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {HOW_IT_WORKS_STEPS.map((step) => (
                            <StepItem key={step.step} {...step} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
