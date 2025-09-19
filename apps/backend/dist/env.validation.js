"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnvSchema = void 0;
const zod_1 = require("zod");
exports.EnvSchema = zod_1.z.object({
    NODE_ENV: zod_1.z.enum(['development', 'test', 'production']).default('development'),
    PORT: zod_1.z.coerce.number().int().min(1).max(65535).default(3000),
    DATABASE_URL: zod_1.z.string().url().or(zod_1.z.string().startsWith('postgresql://')),
    JWT_ACCESS_SECRET: zod_1.z.string().min(12, 'JWT must be at least 12 characters'),
    JWT_ACCESS_EXPIRES: zod_1.z.string().default('30m'),
    JWT_REFRESH_SECRET: zod_1.z.string().min(12, 'JWT must be at least 12 characters'),
    JWT_REFRESH_EXPIRES: zod_1.z.string().default('3d'),
    RATE_TTL: zod_1.z.number().int().default(60),
    RATE_LIMIT: zod_1.z.number().int().default(100),
});
//# sourceMappingURL=env.validation.js.map