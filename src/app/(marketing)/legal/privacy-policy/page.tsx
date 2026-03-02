import { Metadata } from 'next';
import { PolicyPageLayout } from '@/components/legal/PolicyPageLayout';
import { MarkdownContent } from '@/components/legal/MarkdownContent';
import { readPolicyMarkdown, extractLastUpdated, normalizePolicyMarkdown } from '@/lib/legal/readPolicyMarkdown';

export const metadata: Metadata = {
    title: 'Ex-Payments - Privacy Policy',
    description: 'Privacy Policy for Ex-Payments Ltd.',
};

export default async function PrivacyPolicyPage() {
    const raw = await readPolicyMarkdown('PrivacyPolicy.md');
    const lastUpdated = extractLastUpdated(raw);
    const content = normalizePolicyMarkdown(raw, 'Privacy Policy');

    return (
        <PolicyPageLayout title="Privacy Policy" lastUpdated={lastUpdated}>
            <MarkdownContent content={content} />
        </PolicyPageLayout>
    );
}
