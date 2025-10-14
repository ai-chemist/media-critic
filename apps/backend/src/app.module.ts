import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR, APP_FILTER } from '@nestjs/core';
import { LoggerModule } from 'nestjs-pino';


import { PrismaModule } from './prisma/prisma.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { EnvSchema } from './config/env.schema';
import { AuthModule } from './auth/auth.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
// import { UsersModule } from './users/users.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            // 런타임 검증 - src/config/env.schema.ts
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
        AuthModule,
    ],
    providers: [
        { provide: APP_GUARD, useClass: JwtAuthGuard },
        { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
        { provide: APP_FILTER, useClass: HttpExceptionFilter }
    ],
})
export class AppModule {}