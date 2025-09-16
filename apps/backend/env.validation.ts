import { z } from 'zod';

export const EnvSchema = z.object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    PORT: z.coerce.number().int().min(1).max(65535).default(3000),

    DATABASE_URL: z.string().url().or(z.string().startsWith('postgresql://')),

    JWT_ACCESS_SECRET: z.string().min(12, 'JWT must be at least 12 characters'),
    JWT_ACCESS_EXPIRES: z.string().default('30m'),

    JWT_REFRESH_SECRET: z.string().min(12, 'JWT must be at least 12 characters'),
    JWT_REFRESH_EXPIRES: z.string().default('3d'),

    RATE_TTL: z.number().int().default(60),
    RATE_LIMIT: z.number().int().default(100),
});

export type Env = z.infer<typeof EnvSchema>;