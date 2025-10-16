import { z } from 'zod';
export declare const EnvSchema: z.ZodObject<{
    PORT: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    CORS_ORIGIN: z.ZodDefault<z.ZodString>;
    JWT_ACCESS_SECRET: z.ZodString;
    JWT_ACCESS_EXPIRES: z.ZodDefault<z.ZodString>;
    JWT_REFRESH_SECRET: z.ZodString;
    JWT_REFRESH_EXPIRES: z.ZodDefault<z.ZodString>;
    JWT_REFRESH_COOKIE_NAME: z.ZodDefault<z.ZodString>;
    JWT_ISSUER: z.ZodDefault<z.ZodString>;
    JWT_AUDIENCE: z.ZodDefault<z.ZodString>;
}, z.core.$strip>;
export type Env = z.infer<typeof EnvSchema>;
