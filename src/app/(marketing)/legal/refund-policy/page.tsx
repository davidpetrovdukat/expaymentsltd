import { Metadata } from 'next';
import { PolicyPageLayout } from '@/components/legal/PolicyPageLayout';
import { MarkdownContent } from '@/components/legal/MarkdownContent';
import { readPolicyMarkdown, extractLastUpdated, normalizePolicyMarkdown } from '@/lib/legal/readPolicyMarkdown';

export const metadata: Metadata = {
    title: 'Ex-Payments - Refund Policy',
    description: 'Refund Policy for Ex-Payments Ltd.',
};

export default async function RefundPolicyPage() {
    const raw = await readPolicyMarkdown('RefundPolicy.md');
    const lastUpdated = extractLastUpdated(raw);
    const content = normalizePolicyMarkdown(raw, 'Refund Policy');

    return (
        <PolicyPageLayout title="Refund Policy" lastUpdated={lastUpdated}>
            <MarkdownContent content={content} />
        </PolicyPageLayout>
    );
}
