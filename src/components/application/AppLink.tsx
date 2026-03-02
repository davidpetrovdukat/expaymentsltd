'use client';

import Link from 'next/link';
import React from 'react';

const APP_ID_KEY = 'applicationId';

interface AppLinkProps extends Omit<React.ComponentProps<typeof Link>, 'onClick'> {
    /** Set sessionStorage to this application ID before navigating. */
    applicationId?: string;
    /** If true, clears sessionStorage applicationId (for "New Application"). */
    clearId?: boolean;
}

/**
 * Thin wrapper around next/link that sets or clears the applicationId
 * in sessionStorage before navigation. Used from the Server Component
 * dashboard to pass application context to client-side step pages.
 */
export function AppLink({ applicationId, clearId, children, ...props }: AppLinkProps) {
    function handleClick() {
        try {
            if (clearId) {
                sessionStorage.removeItem(APP_ID_KEY);
            } else if (applicationId) {
                sessionStorage.setItem(APP_ID_KEY, applicationId);
            }
        } catch { /* private mode / quota */ }
    }

    return (
        <Link onClick={handleClick} {...props}>
            {children}
        </Link>
    );
}
