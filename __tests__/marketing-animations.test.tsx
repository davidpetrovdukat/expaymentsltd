import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button } from '@/components/ui/button';
import { IntegrationsSection } from '@/components/marketing/sections/IntegrationsSection';

describe('Advanced Animations Verification', () => {
    it('Primary buttons have lift and glow animations on hover', () => {
        render(<Button>Primary Action</Button>);
        const button = screen.getByRole('button', { name: /primary action/i });

        // Check for the standard transition classes
        expect(button.className).toContain('transition-all');
        expect(button.className).toContain('duration-300');

        // Check for hover lift and shadow
        expect(button.className).toContain('hover:-translate-y-[3px]');
        expect(button.className).toContain('hover:shadow-glow');

        // Check for active press down
        expect(button.className).toContain('active:translate-y-0');
        expect(button.className).toContain('active:shadow-sm');
    });

    it('Secondary buttons have subtle hover effects', () => {
        render(<Button variant="outline">Secondary Action</Button>);
        const button = screen.getByRole('button', { name: /secondary action/i });

        // Outline variants should have a subtler lift
        expect(button.className).toContain('hover:-translate-y-[2px]');
        expect(button.className).toContain('hover:shadow-md');
    });

    it('Integrations section icons have float micro-interactions', () => {
        const { container } = render(<IntegrationsSection />);

        // The wrapper of the icons should have the hover triggers
        const integrationWrappers = container.querySelectorAll('.group');
        expect(integrationWrappers.length).toBeGreaterThan(0);

        // Check the first integration item for the required animation classes
        const firstWrapper = integrationWrappers[0] as HTMLElement;
        expect(firstWrapper.className).toContain('hover:scale-110');
        expect(firstWrapper.className).toContain('hover:-translate-y-2');
    });
});
