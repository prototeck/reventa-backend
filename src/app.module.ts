import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GraphQLModule } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { Request, Response } from 'express';
import fetch from 'node-fetch';

import configs from './config/config.json';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { Config } from './types.d';
import { AuthenticationModule } from './authentication/authentication.module';

const environment = process.env.NODE_ENV || 'development';

const config: Config = configs[environment];

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface Global {
      fetch: typeof fetch;
      config: Config;
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
    }),
    GraphQLModule.forRoot({
      playground: true,
      installSubscriptionHandlers: true,
      autoSchemaFile: 'schema.gql',
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
