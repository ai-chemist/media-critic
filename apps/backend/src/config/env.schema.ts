// 환경 변수 유효성 검증
import { z } from 'zod';

export const EnvSchema = z.object({
    // SERVER
    // coerce: string -> number 타입 강제
    PORT: z.coerce.number().int().positive().default(3000),
    CORS_ORIGIN: z.string().default('http://localhost:3001'),

    // JWT ACCESS
    // 최소 16자 조건 확인
    JWT_ACCESS_SECRET: z.string().min(16),
    // 기본 값 15m 설정
    JWT_ACCESS_EXPIRES: z.string().default('15m'),

    // JWT REFRESH
    JWT_REFRESH_SECRET: z.string().min(16),
    JWT_REFRESH_EXPIRES: z.string().default('7d'),
    JWT_REFRESH_COOKIE_NAME: z.string().default('rt'),

    // 검증
    JWT_ISSUER: z.string().default('api'),
    JWT_AUDIENCE: z.string().default('web'),

});

// Env Type 추출
export type Env = z.infer<typeof EnvSchema>;