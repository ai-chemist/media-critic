"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnvSchema = void 0;
const zod_1 = require("zod");
exports.EnvSchema = zod_1.z.object({
    NODE_ENV: zod_1.z.enum(['development', 'test', 'production']).default('development'),
    PORT: zod_1.z.coerce.number().int().min(1).max(65535).default(3000),
    DATABASE_URL: zod_1.z.string().url().or(zod_1.z.string().startsWith('postgresql://')),
    JWT_SECRET: zod_1.z.string().min(12, 'JWT must be at least 12 characters'),
    JWT_EXPIRES_IN: zod_1.z.string().default('id'),
});
//# sourceMappingURL=env.validation.js.map