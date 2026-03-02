import { HeroSection } from '@/components/marketing/sections/HeroSection';
import { LogosBarSection } from '@/components/marketing/sections/LogosBarSection';
import { ValuePropsSection } from '@/components/marketing/sections/ValuePropsSection';
import { SolutionsSection } from '@/components/marketing/sections/SolutionsSection';
import { IntegrationsSection } from '@/components/marketing/sections/IntegrationsSection';
import { IndustriesSection } from '@/components/marketing/sections/IndustriesSection';
import { GlobalCoverageSection } from '@/components/marketing/sections/GlobalCoverageSection';
import { HowItWorksSection } from '@/components/marketing/sections/HowItWorksSection';
import { DeveloperSection } from '@/components/marketing/sections/DeveloperSection';

export default function MarketingPage() {
    return (
        <>
            <HeroSection />
            <LogosBarSection />
            <ValuePropsSection />
            <SolutionsSection />
            <IntegrationsSection />
            <IndustriesSection />
            <GlobalCoverageSection />
            <HowItWorksSection />
            <DeveloperSection />
        </>
    );
}
