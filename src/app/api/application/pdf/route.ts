import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getUserOrThrow, getApplicationById } from '@/server/application/draft';
import { generateApplicationPdf } from '@/server/pdf/application-pdf';

export const dynamic = 'force-dynamic';

/**
 * GET /api/application/pdf?applicationId=...
 * Returns the application PDF for the authenticated user. Uses session-bound client, RLS.
 * Application must belong to user and have status PENDING or SIGNED.
 */
export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient();
        const userId = await getUserOrThrow(supabase);

        const applicationId = request.nextUrl.searchParams.get('applicationId');
        if (!applicationId?.trim()) {
            return NextResponse.json(
                { error: 'applicationId is required' },
                { status: 400 }
            );
        }

        const row = await getApplicationById(supabase, applicationId.trim(), userId);
        if (!row) {
            return NextResponse.json(
                { error: 'Application not found or access denied' },
                { status: 404 }
            );
        }

        const allowedStatuses = ['PENDING', 'SIGNED'];
        if (!allowedStatuses.includes(row.status)) {
            return NextResponse.json(
                { error: 'Application is not available for download' },
                { status: 403 }
            );
        }

        const submittedAt = row.submitted_at ?? row.updated_at;
        const formData = (row.form_data ?? {}) as Record<string, unknown>;

        const pdfBuffer = await generateApplicationPdf(formData, submittedAt);
        const filename = `application-${row.id}.pdf`;

        return new NextResponse(new Uint8Array(pdfBuffer), {
            status: 200,
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="${filename}"`,
            },
        });
    } catch (error: unknown) {
        if (error instanceof Error && error.message === 'Unauthorized') {
            return new NextResponse('Unauthorized', { status: 401 });
        }
        console.error('GET /api/application/pdf error:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
