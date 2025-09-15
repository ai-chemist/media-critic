import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { json, urlencoded } from 'express';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import compression from 'compression';

async function bootstrap() {
  const app: NestExpressApplication = await NestFactory.create(AppModule);

  // 요청 본문 크기 제한
    const limit = process.env.REQUEST_BODY_LIMIT || '1mb';
    app.use(json({ limit }));
    app.use(urlencoded({ extended: true, limit }));

  // 보안 헤더 적용
  app.use(helmet());

  // 응답 압축 - 1024 byte 이상 압축
  const threshold = Number(process.env.COMPRESSION_THRESHOLD) || 1024;

  app.use(
    compression({
      threshold,
      filter: (req, res) => {
        // Client 'no-transform' 등 조건이 있는 경우 넘기
        if (req.headers['x-no-transform'] || res.getHeader('Content-Type')?.toString().includes('image')) {
          return false;
        }
        return compression.filter(req, res);
      },
    }),
  );

  // CORS
  app.enableCors({
      // ?? true - .env에 환경변수가 없을 경우 모든 origin 허용
      // TODO: 배포 시 true 옵션 반드시 해제할 것
      origin: process.env.CORS_ORIGIN?.split(',') ?? true,
      credentials: true,
      methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
  });

  app.set('trust proxy', 1);

  // 전역으로 매개변수 관리를 위한 설정
  app.useGlobalPipes(new ValidationPipe({
      transform: true,
      whitelist: true,
  }));

  // Swagger - DocumentBuilder 및 편의성
    const config = new DocumentBuilder()
        .setTitle('Media Critic API')
        .setDescription('The Media Critic API description')
        .setVersion('0.1')
        .addBearerAuth() // Jwt 활성화
        .build();

    const document = SwaggerModule.createDocument(app, config);
    // http://localhost:3000/api 경로로 접근 시 확인 가능
    SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
