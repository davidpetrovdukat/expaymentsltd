'use server'

import { createClient } from '@/lib/supabase/server';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

/**
 * Derives the origin from the incoming request headers so email redirect
 * URLs always match the domain the user is visiting (www vs apex).
 * Falls back to NEXT_PUBLIC_SITE_URL if the header is missing.
 */
async function siteBaseUrl(): Promise<string> {
    const h = await headers();
    const origin = h.get('origin') || h.get('x-forwarded-host') || h.get('host');
    if (origin) {
        const proto = h.get('x-forwarded-proto') || 'https';
        const host = origin.replace(/^https?:\/\//, '');
        return `${proto}://${host}`;
    }
    return (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ex-payments.com').replace(/\/+$/, '');
}

export async function loginAction(prevState: unknown, formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email || !password) {
        return { error: 'Email and password are required' };
    }

    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        if (error.message.includes('Email not confirmed')) {
            return { error: 'Please check your email for a confirmation link before logging in.' };
        }
        return { error: error.message };
    }

    redirect('/dashboard');
}

export async function signUpAction(prevState: unknown, formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirm-password') as string;

    if (!email || !password) {
        return { error: 'Email and password are required' };
    }

    if (password !== confirmPassword) {
        return { error: 'Passwords do not match' };
    }

    const supabase = await createClient();
    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            emailRedirectTo: `${await siteBaseUrl()}/auth/callback?next=${encodeURIComponent('/auth/confirm')}`,
        },
    });

    if (error) {
        return { error: error.message };
    }

    redirect('/check-email?mode=verify');
}

export async function forgotPasswordAction(prevState: unknown, formData: FormData) {
    const email = formData.get('email') as string;

    if (!email) {
        return { error: 'Email is required' };
    }

    const supabase = await createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${await siteBaseUrl()}/auth/callback?next=${encodeURIComponent('/reset-password')}`,
    });

    if (error) {
        return { error: error.message };
    }

    redirect('/check-email?mode=recovery');
}

export async function resetPasswordAction(prevState: unknown, formData: FormData) {
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirm-password') as string;

    if (!password) {
        return { error: 'Password is required' };
    }

    if (password !== confirmPassword) {
        return { error: 'Passwords do not match' };
    }

    const supabase = await createClient();
    const { error } = await supabase.auth.updateUser({
        password: password,
    });

    if (error) {
        return { error: error.message };
    }

    redirect('/login?reset=success');
}
