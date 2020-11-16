import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthenticationModule } from '@/authentication/authentication.module';

import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { USER_SCHEMA } from './user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: USER_SCHEMA }]),
    AuthenticationModule,
  ],
  providers: [UserService, UserResolver],
  exports: [UserService],
})
export class UserModule {}
