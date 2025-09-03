import { z } from 'zod';
export declare const EnvSchema: z.ZodObject<{
    NODE_ENV: z.ZodDefault<z.ZodEnum<{
        development: "development";
        test: "test";
        production: "production";
    }>>;
    PORT: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    DATABASE_URL: z.ZodUnion<[z.ZodString, z.ZodString]>;
    JWT_SECRET: z.ZodString;
    JWT_EXPIRES_IN: z.ZodDefault<z.ZodString>;
}, z.core.$strip>;
export type Env = z.infer<typeof EnvSchema>;
