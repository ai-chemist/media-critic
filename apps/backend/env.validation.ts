import { z } from 'zod';

export const EnvSchema = z.object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    PORT: z.coerce.number().int().min(1).max(65535).default(3000),

    DATABASE_URL: z.string().url().or(z.string().startsWith('postgresql://')),

    JWT_SECRET: z.string().min(12, 'JWT must be at least 12 characters'),
    JWT_EXPIRES_IN: z.string().default('id'),
});

export type Env = z.infer<typeof EnvSchema>;