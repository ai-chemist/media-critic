import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 전역으로 매개변수 관리를 위한 설정
  app.useGlobalPipes(new ValidationPipe({
      transform: true,
      whitelist: true,
  }))
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
