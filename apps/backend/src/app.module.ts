import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';

import { PrismaModule } from './prisma/prisma.module';
import { EnvSchema } from './config/env.schema';
// import { AuthModule } from './auth/auth.module';
// import { UsersModule } from './users/users.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            // 런타임 검증
            validate: (raw) => EnvSchema.parse(raw),
        }),
        LoggerModule.forRoot({
            pinoHttp: {
                // 개발 환경 pretty 적용
                transport: process.env.NODE_ENV !== 'production'
                    ? { target: 'pino-pretty', options: { singleLine: true } }
                    : undefined,
                // authorization, cookie 등 민감정보 제어
                redact: ['req.headers.authorization', 'req.headers.cookie'],
            },
        }),
        PrismaModule,
    ],
})
export class AppModule {}