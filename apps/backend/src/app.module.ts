import { Module } from '@nestjs/common';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { MediaModule } from './media/media.module';
import { RatingsModule } from './ratings/ratings.module';
import { AuthModule } from './auth/auth.module';
import { HealthController } from './health.controller';

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
      ],
})
export class AppModule {}
