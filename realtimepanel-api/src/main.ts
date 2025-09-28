import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { provisionDatabase } from './data/provision-database';
import * as express from 'express';
import { join } from 'path';

async function bootstrap() {
  await provisionDatabase();

  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Eliminar propiedades desconocidas en las solicitudes
      forbidNonWhitelisted: true,
    }),
  );

  // Habilitar CORS
  app.enableCors({
    methods: 'GET,POST,PATCH,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
  });

  // Servir archivos estáticos desde la carpeta public/images
  app.use('/images', express.static(join(__dirname, '..', 'public/images')));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
