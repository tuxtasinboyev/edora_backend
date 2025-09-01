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

  // TO'G'RI CORS SOZLAMASI
  app.enableCors({
    origin: function (origin, callback) {
      // Barcha domainlarga ruxsat berish
      callback(null, true);
      
      // Agar ma'lum domainlarga cheklab qo'ymoqchi bo'lsangiz:
      // const allowedOrigins = [
      //   'http://localhost:5173',
      //   'http://localhost:3000',
      //   'http://18.199.221.227:1709',
      //   'https://your-production-domain.com'
      // ];
      // if (!origin || allowedOrigins.includes(origin)) {
      //   callback(null, true);
      // } else {
      //   callback(new Error('Not allowed by CORS'));
      // }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: 'Content-Type, Authorization, X-Requested-With, Accept, Origin, X-CSRF-Token',
    preflightContinue: false,
    optionsSuccessStatus: 204
  });

  // OPTIONS so'rovlarini qayta ishlash (qo'shimcha)
  app.use((req, res, next) => {
    if (req.method === 'OPTIONS') {
      res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin, X-CSRF-Token');
      res.status(200).end();
      return;
    }
    next();
  });

  const config = new DocumentBuilder()
    .setTitle('API hujjatlari')
    .setDescription('Ushbu loyiha uchun auto-generated Swagger dokumentatsiya')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api/edura', app, document);

  await app.listen(1709);
  console.log('🚀 Server ishladi: http://localhost:1709/api/edura');
}
bootstrap();