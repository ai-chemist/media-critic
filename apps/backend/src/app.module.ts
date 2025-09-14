import { Module, MiddlewareConsumer } from '@nestjs/common';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { RequestIdMiddleware } from './common/middlewares/request-id.middleware';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { APP_GUARD, APP_INTERCEPTOR, APP_FILTER } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { MediaModule } from './media/media.module';
import { RatingsModule } from './ratings/ratings.module';
import { AuthModule } from './auth/auth.module';
import { HealthController } from './health.controller';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

@Module({
  imports: [
      // 모든 요청에 대하여 일관적으로 적용하기 위하여 forRoot를 사용하여 전역 처리
      ThrottlerModule.forRoot([
          {
              ttl: Number(process.env.RATE_TTL) ?? 60,
              limit: Number(process.env.RATE_LIMIT) ?? 10,
          },
      ]),
      PrismaModule,
      UsersModule,
      MediaModule,
      RatingsModule,
      AuthModule
  ],
  controllers: [
      AppController,
      HealthController,
  ],
  providers: [
      AppService,
      { provide: APP_GUARD, useClass: ThrottlerGuard }, // 전역 Rate Limit
      { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
      { provide: APP_FILTER, useClass: HttpExceptionFilter },
      ],
})
export class AppModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(RequestIdMiddleware).forRoutes('*');
    }
}
