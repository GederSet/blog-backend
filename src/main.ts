import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as express from 'express';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  // Отключаем CORC
  const app = await NestFactory.create(AppModule, { cors: false });
  app.enableCors({ credentials: true, origin: true });

  // Если обращаемся по этой ссылке, то выдаем нужные картинки
  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));

  // Подключаем swagger
  const config = new DocumentBuilder()
    .setTitle('Блог')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  // Запускаем сервер по порту 8000
  await app.listen(8000);
}
bootstrap();
