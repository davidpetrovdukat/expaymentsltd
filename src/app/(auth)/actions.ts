'use server'

import { createClient } from '@/lib/supabase/server';
import { publicEnv } from '@/lib/env/public';
import { redirect } from 'next/navigation';

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
            emailRedirectTo: `${publicEnv.NEXT_PUBLIC_SITE_URL}/auth/callback?next=${encodeURIComponent('/login?verified=1')}`,
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
        redirectTo: `${publicEnv.NEXT_PUBLIC_SITE_URL}/auth/callback?next=/reset-password`,
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
