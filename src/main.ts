import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { VersioningType, ValidationPipe, ValidationError } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { join } from 'path';
import express from 'express';

import { AppModule } from './app.module';

import { TransformInterceptor } from '@Common/interceptors/transform.interceptor';
import { AllExceptionsFilter } from '@Common/filters/exception.filter';

import { ValidationExeption } from '@Common/exceptions/validation.exception';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use('/public', express.static(join(__dirname, '..', 'public')));
  app.use('/resources', express.static(join(__dirname, '..', 'resources')));

  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new TransformInterceptor());
  app.setGlobalPrefix('api');
  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (_errors: ValidationError[]) => {
        console.log(_errors);
        const errors = [];
        _errors.forEach((_error) => {
          errors.push(...Object.values(_error.constraints));
        });
        return new ValidationExeption(errors);
      },
    }),
  );

  app.enableVersioning({
    type: VersioningType.URI,
  });

  // Swagger
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Recruitment API')
    .setDescription('Recruitment API description')
    .setVersion('1.0')
    .addBearerAuth(
      {
        description: `Please enter token in following format: Bearer {Token}`,
        name: 'Authorization',
        bearerFormat: 'Bearer',
        scheme: 'Bearer',
        type: 'http',
        in: 'Header',
      },
      'access-token',
    )
    .build();

  const doc = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('document', app, doc);

  await app.listen(process.env.PORT);
}
bootstrap().then(() => console.log('Service listening on port:', process.env.PORT));
