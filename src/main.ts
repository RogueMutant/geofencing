import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.set('trust proxy', true);
  await app.listen(process.env.PORT ?? 3000);
  console.log(`Server listening on port ${3000}`);
}
bootstrap();
