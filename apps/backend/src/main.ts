import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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
