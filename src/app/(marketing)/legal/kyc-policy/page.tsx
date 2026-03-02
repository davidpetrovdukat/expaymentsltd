import { Metadata } from 'next';
import { PolicyPageLayout } from '@/components/legal/PolicyPageLayout';
import { MarkdownContent } from '@/components/legal/MarkdownContent';
import { readPolicyMarkdown, extractLastUpdated, normalizePolicyMarkdown } from '@/lib/legal/readPolicyMarkdown';

export const metadata: Metadata = {
    title: 'Ex-Payments - KYC Policy',
    description: 'KYC Policy for Ex-Payments Ltd.',
};

export default async function KycPolicyPage() {
    const raw = await readPolicyMarkdown('KYCPolicy.md');
    const lastUpdated = extractLastUpdated(raw);
    const content = normalizePolicyMarkdown(raw, 'KYC Policy');

    return (
        <PolicyPageLayout title="KYC Policy" lastUpdated={lastUpdated}>
            <MarkdownContent content={content} />
        </PolicyPageLayout>
    );
}
