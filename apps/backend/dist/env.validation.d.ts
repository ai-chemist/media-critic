import { z } from 'zod';
export declare const EnvSchema: z.ZodObject<{
    NODE_ENV: z.ZodDefault<z.ZodEnum<{
        development: "development";
        test: "test";
        production: "production";
    }>>;
    PORT: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    DATABASE_URL: z.ZodUnion<[z.ZodString, z.ZodString]>;
    JWT_ACCESS_SECRET: z.ZodString;
    JWT_ACCESS_EXPIRES: z.ZodDefault<z.ZodString>;
    JWT_REFRESH_SECRET: z.ZodString;
    JWT_REFRESH_EXPIRES: z.ZodDefault<z.ZodString>;
    RATE_TTL: z.ZodDefault<z.ZodNumber>;
    RATE_LIMIT: z.ZodDefault<z.ZodNumber>;
}, z.core.$strip>;
export type Env = z.infer<typeof EnvSchema>;
