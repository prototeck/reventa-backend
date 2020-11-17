import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GraphQLModule } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { Request, Response } from 'express';
import fetch from 'node-fetch';

import configs from './config/config.json';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { IConfig } from './typings';
import { corsConfig } from './utils';
import { UserModule } from './user/user.module';
import { EventModule } from './event/event.module';
// import { BookingModule } from './booking/booking.module';
import { AuthenticationModule } from './authentication/authentication.module';

const environment = process.env.NODE_ENV || 'development';

const config: IConfig = configs[environment];

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    interface Global {
      fetch: typeof fetch;
      config: IConfig;
    }
  }
}

// for cognito
global.fetch = fetch;

global.config = config;

export const pubsub = new PubSub();

@Module({
  imports: [
    MongooseModule.forRoot(config.mongo.uri, {
      dbName: config.mongo.dbname,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      // useFindAndModify: true,
    }),
    GraphQLModule.forRoot({
      playground: true,
      installSubscriptionHandlers: true,
      autoSchemaFile: 'schema.gql',
      cors: { ...corsConfig },
      // formatError: error => {
      //   if (
      //     typeof error.extensions?.exception.response !== 'string' &&
      //     error.extensions?.exception.response.message
      //   ) {
      //     return {
      //       status: error.extensions.exception.response.statusCode,
      //       message: error.extensions.exception.response.message[0],
      //     };
      //   }

      //   return error;
      // },
      context: async ({
        req: request,
        res: response,
      }: {
        req: Request;
        res: Response;
      }) => {
        return {
          config,
          pubsub,
          request,
          response,
          // subscriptionTypes,
          headers: (request && request.headers) || {},
        };
      },
    }),
    UserModule,
    AuthenticationModule,
    EventModule,
    // BookingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
