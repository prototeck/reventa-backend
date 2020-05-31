import { createParamDecorator } from '@nestjs/common';
import { CustomParamFactory } from '@nestjs/common/interfaces';
import { GraphQLResolveInfo } from 'graphql';

import { User as UserType } from '../user/interfaces/user.interface';

export const userFactory: CustomParamFactory = (
  data: any,
  [root, args, context, info]: [object, any, any, GraphQLResolveInfo],
): UserType => JSON.parse(context.headers.user || '{"_id":""}');

export const User = createParamDecorator(userFactory);
export type User = UserType;
