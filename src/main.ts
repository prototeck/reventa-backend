import { NestFactory } from '@nestjs/core';
import * as bodyParser from 'body-parser';
import { ValidationPipe } from '@nestjs/common';
import {
  WinstonModule,
  utilities as nestWinstonModuleUtilities,
} from 'nest-winston';
import * as winston from 'winston';
import morgan from 'morgan';

import { AppModule } from './app.module';
import { corsConfig } from './utils';

const winstonLogger = WinstonModule.createLogger({
  level: 'debug',
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        nestWinstonModuleUtilities.format.nestLike(),
      ),
    }),
    new winston.transports.File({
      filename: 'info.log',
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
    }),
    new winston.transports.File({
      filename: 'errors.log',
      level: 'error',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
    }),
  ],
  exceptionHandlers: [
    new winston.transports.File({
      filename: 'exceptions.log',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
    }),
  ],
});

const myStream = {
  write: (text: string) => {
    winstonLogger.log(text);
  },
};

async function bootstrap() {
  const port = 3001;

  const app = await NestFactory.create(AppModule, {
    logger: winstonLogger,
  });

  app.use(
    morgan(
      'timestamp{:date[iso]} :method :url :status :response-time ms - :res[content-length] ":referrer"',
      {
        stream: myStream,
      },
    ),
  );

  app.enableCors(corsConfig);
  app.useGlobalPipes(new ValidationPipe());
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

  await app.listen(process.env.PORT || port);
}
bootstrap();
