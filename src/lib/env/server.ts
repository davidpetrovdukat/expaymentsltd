import 'server-only';
import { z } from 'zod';

const isBuildPhase = process.env.NEXT_PHASE === 'phase-production-build';

const serverEnvSchema = z.object({
    SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
    RESEND_API_KEY: z.string().startsWith('re_').optional(),
    COMPLIANCE_EMAIL_TO: z.string().email().optional().default('compliance@ex-payments.com'),
    HEALTHCHECK_TOKEN: z.string().optional(),
});

export const serverEnv = isBuildPhase
    ? ({} as z.infer<typeof serverEnvSchema>)
    : serverEnvSchema.parse({
        SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
        RESEND_API_KEY: process.env.RESEND_API_KEY,
        COMPLIANCE_EMAIL_TO: process.env.COMPLIANCE_EMAIL_TO,
        HEALTHCHECK_TOKEN: process.env.HEALTHCHECK_TOKEN,
    });
