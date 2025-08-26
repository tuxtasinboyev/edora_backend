import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true, 
      },
    }),
  );

  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads'
  });

  const config = new DocumentBuilder()
    .setTitle('API hujjatlari')
    .setDescription('Ushbu loyiha uchun auto-generated Swagger dokumentatsiya')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

    app.enableCors({
      origin: true,
      credentials: true,
    });
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api/edura', app, document);

  await app.listen(1709);
  console.log('🚀 Server ishladi: http://localhost:1709/api/edura');
}
bootstrap();
//salom
