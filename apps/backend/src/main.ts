import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from 'nestjs-pino';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';

async function bootstrap(): Promise<void> {
  const app: INestApplication<any> = await NestFactory.create(AppModule, { bufferLogs: true }); // pino 사용을 위해 로그를 메모리에 버퍼링 한 뒤 pino 준비 완료 후 출력

  // 로거 사용 (Logger: Pino)
  app.useLogger(app.get(Logger));

  // 보안 헤더 (Security Header)
  app.use(helmet());

  // 쿠키 파싱 (Cookie Parsing)
  app.use(cookieParser());

  // 전역 파이프 설정 (Global Pipe)
  app.useGlobalPipes(new ValidationPipe({
      whitelist: true,  // DTO에 없는 필드 차단
      forbidNonWhitelisted: true,  // 알 수 없는 필드 차단
      transform: true,  // payload to DTO 변환
      transformOptions: {
          enableImplicitConversion: true,  // 암묵적 타입 변환 허용
      }
  }));

  // CORS (Cross Origin Resource Sharing) 활성화
  app.enableCors({
      origin: process.env.CORS_ORIGIN?.split(',') ?? ['http://localhost:3001'],
      credentials: true,  // 쿠키 및 토큰 사용을 위해 허용
  });

  // 전역 prefix(접두어) 설정
  app.setGlobalPrefix('api');  // 모든 라우트 경로 앞에 /api 부여

  await app.listen(process.env.PORT ?? 3000);

  // 부팅 완료 로그 출력
  app.get(Logger).log(`Application Listening on Port ${process.env.PORT ?? 3000}`);
}
bootstrap();
