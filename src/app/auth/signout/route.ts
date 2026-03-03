import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/** GET is not used for sign-out; prevents prefetch (e.g. Next.js Link) from signing the user out. */
export async function GET() {
    return new NextResponse('Method Not Allowed', {
        status: 405,
        headers: { Allow: 'POST' },
    });
}

/** Sign out only on explicit POST (e.g. form submit). Redirect uses request origin (no NEXT_PUBLIC_SITE_URL). */
export async function POST(request: NextRequest) {
    const supabase = await createClient();
    await supabase.auth.signOut();
    return NextResponse.redirect(new URL('/login', request.url));
}
