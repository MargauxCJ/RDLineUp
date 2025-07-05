import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from 'src/common/filters/exception-filter';
import {join} from 'path';
import * as express from 'express';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors({
    origin: ['http://localhost:8100', 'http://localhost:4200'],
    methods: 'GET, POST, PUT, DELETE',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true,
  });
  app.useGlobalFilters(new AllExceptionsFilter());
  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));
  await app.listen(3000);
}
bootstrap();
