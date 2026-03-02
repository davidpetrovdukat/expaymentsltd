import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { publicEnv } from '@/lib/env/public';

export async function updateSession(request: NextRequest) {
    // Create an unmodified response
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    });

    const supabase = createServerClient(
        publicEnv.NEXT_PUBLIC_SUPABASE_URL,
        publicEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
                    response = NextResponse.next({
                        request,
                    });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    );
                },
            },
        }
    );

    const { data: { user } } = await supabase.auth.getUser();

    const isAuthRoute = request.nextUrl.pathname.startsWith('/login')
        || request.nextUrl.pathname.startsWith('/sign-up')
        || request.nextUrl.pathname.startsWith('/check-email')
        || request.nextUrl.pathname.startsWith('/forgot-password')
        || request.nextUrl.pathname.startsWith('/reset-password');

    const isDashboardRoute = request.nextUrl.pathname.startsWith('/dashboard')
        || request.nextUrl.pathname.startsWith('/application');

    // Logged-in user on auth pages → redirect to dashboard
    if (user && isAuthRoute) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // Not logged in on dashboard pages → redirect to login
    if (!user && isDashboardRoute) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return response;
}
