import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { publicEnv } from '@/lib/env/public';

export async function GET() {
    const supabase = await createClient();

    // Sign out from Supabase (clears the session cookie)
    await supabase.auth.signOut();

    // Redirect to login page
    return NextResponse.redirect(new URL('/login', publicEnv.NEXT_PUBLIC_SITE_URL));
}
