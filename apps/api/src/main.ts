import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

async function bootstrap() {

  const app = await NestFactory.create(AppModule);

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Thinkx-admin-API')
    .setDescription('Backend API fo Thinkx devices')
    .setVersion('1.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'JWT',
      description: 'Enter JWT token',
      in: 'header',
    },
      'JWT-auth')
    .build();

  app.setGlobalPrefix('v1');

  const document = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup('api', app, document);

  app.enableCors();

  await app.listen(environment.port || process.env.PORT)
  Logger.log(environment.port, 'APP PORT');

  if (environment.production) {
    Logger.log('running app on production mode')
  } else {
    Logger.log('running app on non production mode')
  }
}

bootstrap();
