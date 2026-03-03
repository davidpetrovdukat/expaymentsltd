import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/** Allow only relative paths (same-origin); reject protocol-relative or absolute URLs. */
function safeNext(next: string | null): string {
    if (next != null && next.startsWith('/') && !next.startsWith('//')) {
        return next;
    }
    return '/dashboard';
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const next = safeNext(searchParams.get('next'));

    if (code) {
        const supabase = await createClient();
        const { error } = await supabase.auth.exchangeCodeForSession(code);

        if (error) {
            console.error('Exchange code error:', error.message);
            const base = new URL('/auth/confirm', request.url);
            base.searchParams.set('status', 'error');
            base.searchParams.set('message', error.message);
            return NextResponse.redirect(base);
        }
    }

    return NextResponse.redirect(new URL(next, request.url));
}
