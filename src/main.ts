import { NestFactory } from '@nestjs/core';
import * as bodyParser from 'body-parser';

import { AppModule } from './app.module';

async function bootstrap() {
  const port = 4000;

  const app = await NestFactory.create(AppModule);

  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

  console.log('env', process.env.NODE_ENV)
  console.log('port', process.env.PORT)

  await app.listen(process.env.PORT || port);
}
bootstrap();
