"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnvSchema = void 0;
const zod_1 = require("zod");
exports.EnvSchema = zod_1.z.object({
    PORT: zod_1.z.coerce.number().int().positive().default(3000),
    CORS_ORIGIN: zod_1.z.string().default('http://localhost:3001'),
    JWT_ACCESS_SECRET: zod_1.z.string().min(16),
    JWT_ACCESS_EXPIRES: zod_1.z.string().default('15m'),
    JWT_REFRESH_SECRET: zod_1.z.string().min(16),
    JWT_REFRESH_EXPIRES: zod_1.z.string().default('7d'),
    JWT_REFRESH_COOKIE_NAME: zod_1.z.string().default('rt'),
    JWT_ISSUER: zod_1.z.string().default('api'),
    JWT_AUDIENCE: zod_1.z.string().default('web'),
});
//# sourceMappingURL=env.schema.js.map