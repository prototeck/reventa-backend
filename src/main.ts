import { NestFactory } from '@nestjs/core';
import * as bodyParser from 'body-parser';
import { ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';
import { corsConfig } from './utils';

async function bootstrap() {
  const port = 4000;

  const app = await NestFactory.create(AppModule);

  app.enableCors(corsConfig);
  app.useGlobalPipes(new ValidationPipe());
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

  await app.listen(process.env.PORT || port);
}
bootstrap();
