import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import {
    getUserOrThrow,
    getApplicationRow,
    getApplicationById,
    upsertDraftPatch
} from '@/server/application/draft';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient();

        if (process.env.NODE_ENV !== 'production') {
            const host = request.headers.get('host') ?? '(none)';
            const hasSbCookies = request.cookies.getAll().some(c => c.name.startsWith('sb-'));
            const { data: { user: debugUser } } = await supabase.auth.getUser();
            console.log('[draft GET auth]', { host, hasSbCookies, userId: debugUser?.id?.slice(0, 8) ?? null });
        }

        const userId = await getUserOrThrow(supabase);

        const applicationId = request.nextUrl.searchParams.get('applicationId');

        let row;
        if (applicationId) {
            row = await getApplicationById(supabase, applicationId, userId);
        } else {
            row = await getApplicationRow(supabase, userId);
        }

        if (process.env.NODE_ENV === 'development') {
            console.log('[draft GET] user:', userId.slice(0, 8), '| appId:', applicationId?.slice(0, 8) ?? 'auto', '| has_row:', !!row);
        }

        return NextResponse.json(row);
    } catch (error: unknown) {
        if (error instanceof Error && error.message === 'Unauthorized') {
            return new NextResponse('Unauthorized', { status: 401 });
        }
        console.error('GET /api/application/draft error:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();
        const userId = await getUserOrThrow(supabase);

        const body = await request.json();
        const { patch, currentStep, progressPercent, applicationId } = body;

        if (!patch || typeof patch !== 'object') {
            return NextResponse.json(
                { error: 'Invalid payload: patch must be an object', received: { hasPatch: !!patch, typeofPatch: typeof patch } },
                { status: 400 }
            );
        }
        if (typeof currentStep !== 'number' || typeof progressPercent !== 'number') {
            return NextResponse.json(
                { error: 'Invalid payload: currentStep and progressPercent must be numbers', received: { currentStep: typeof currentStep, progressPercent: typeof progressPercent } },
                { status: 400 }
            );
        }

        if (process.env.NODE_ENV === 'development') {
            console.log('[draft POST] user:', userId.slice(0, 8), '| appId:', applicationId?.slice(0, 8) ?? 'auto', '| step:', currentStep, '| keys:', Object.keys(patch).length);
        }

        const result = await upsertDraftPatch(supabase, userId, patch, currentStep, progressPercent, applicationId);

        if (!result.ok) {
            const errorMsg = typeof result.error === 'string' ? result.error : JSON.stringify(result.error);
            return NextResponse.json({ error: errorMsg }, { status: 400 });
        }

        return NextResponse.json({ ok: true, id: result.id, updated_at: result.updated_at });
    } catch (error: unknown) {
        if (error instanceof Error && error.message === 'Unauthorized') {
            return new NextResponse('Unauthorized', { status: 401 });
        }
        console.error('POST /api/application/draft error:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
