import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
    const supabase = await createClient();

    await supabase.auth.signOut();

    // Always redirect relative to the incoming request origin to avoid cross-origin redirects (www ↔ apex)
    return NextResponse.redirect(new URL('/login', request.url));
}
