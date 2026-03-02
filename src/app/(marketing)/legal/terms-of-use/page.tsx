import { Metadata } from 'next';
import { PolicyPageLayout } from '@/components/legal/PolicyPageLayout';
import { MarkdownContent } from '@/components/legal/MarkdownContent';
import { readPolicyMarkdown, extractLastUpdated, normalizePolicyMarkdown } from '@/lib/legal/readPolicyMarkdown';

export const metadata: Metadata = {
    title: 'Ex-Payments - Terms of Use',
    description: 'Terms of Use for Ex-Payments Ltd.',
};

export default async function TermsOfUsePage() {
    const raw = await readPolicyMarkdown('TermsOfUse.md');
    const lastUpdated = extractLastUpdated(raw);
    const content = normalizePolicyMarkdown(raw, 'Terms of Use');

    return (
        <PolicyPageLayout title="Terms of Use" lastUpdated={lastUpdated}>
            <MarkdownContent content={content} />
        </PolicyPageLayout>
    );
}
