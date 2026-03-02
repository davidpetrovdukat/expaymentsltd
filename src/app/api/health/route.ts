import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { serverEnv } from '@/lib/env/server';

export async function GET(request: Request) {
    if (serverEnv.HEALTHCHECK_TOKEN) {
        const authHeader = request.headers.get('x-healthcheck-token');
        if (authHeader !== serverEnv.HEALTHCHECK_TOKEN) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
    }

    try {
        const supabase = await createClient();
        const { data, error } = await supabase.rpc('health');

        if (error) {
            console.error('Healthcheck DB Error:', error);
            return NextResponse.json(
                { ok: false, error: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { ok: true, data },
            { status: 200 }
        );
    } catch (err) {
        console.error('Healthcheck System Error:', err);
        return NextResponse.json(
            { ok: false, error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
