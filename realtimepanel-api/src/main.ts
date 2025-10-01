import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import * as express from 'express';
import { join } from 'path';
import { AppModule } from './app.module';
import { provisionDatabase } from './data/provision-database';
import { LogsService } from './logs/logs.service';

async function bootstrap() {
  await provisionDatabase();

  const app = await NestFactory.create(AppModule);
  const logger = new Logger('NestApplication')

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Eliminar propiedades desconocidas en las solicitudes
      forbidNonWhitelisted: true,
    }),
  );

  app.useLogger(app.get(LogsService))

  // Habilitar CORS
  app.enableCors({
    methods: 'GET,POST,PATCH,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
  });

  // Servir archivos estáticos desde la carpeta public/images
  app.use('/images', express.static(join(__dirname, '..', 'public/images')));

  await app.listen(process.env.PORT ?? 3000);
  logger.log(`"realtimepanel-api" listening on port ${process.env.PORT ?? 3000}`)
}
bootstrap();

