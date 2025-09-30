// 환경 변수 유효성 검증
import { z } from 'zod';

export const EnvSchema = z.object({
    // 최소 16자 조건 확인
    JWT_ACCESS_SECRET: z.string().min(16),
    // 기본 값 15m 설정
    JWT_ACCESS_EXPIRES: z.string().default('15m'),
    // coerce를 통해 Number Type으로 강제
    PORT: z.coerce.number().int().positive().default(3000),
});

// Env Type 추출
export type Env = z.infer<typeof EnvSchema>;