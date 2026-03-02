import { Metadata } from 'next';
import { PolicyPageLayout } from '@/components/legal/PolicyPageLayout';
import { MarkdownContent } from '@/components/legal/MarkdownContent';
import { readPolicyMarkdown, extractLastUpdated, normalizePolicyMarkdown } from '@/lib/legal/readPolicyMarkdown';

export const metadata: Metadata = {
    title: 'Ex-Payments - Corporate Governance Process',
    description: 'Corporate Governance Process for Ex-Payments Ltd.',
};

export default async function CorporateGovernanceProcessPage() {
    const raw = await readPolicyMarkdown('CorporateGovernanceProcess.md');
    const lastUpdated = extractLastUpdated(raw);
    const content = normalizePolicyMarkdown(raw, 'Corporate Governance Process');

    return (
        <PolicyPageLayout title="Corporate Governance Process" lastUpdated={lastUpdated}>
            <MarkdownContent content={content} />
        </PolicyPageLayout>
    );
}
