import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  app.enableCors({
    origin: process.env.NODE_ENV === 'production' ? process.env.FRONTEND_URL : 'http://localhost:3000',
    credentials: true,
  });

  app.useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: '/uploads',
  })

  
  await app.listen(
  process.env.PORT ?? 3001,
  process.env.HOST ?? '0.0.0.0',
  () => {
    console.log(
      `Listening on ${process.env.HOST ?? '0.0.0.0'}:${process.env.PORT ?? 3001}`
    );
  },
);
}
bootstrap();