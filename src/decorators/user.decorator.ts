import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

import { IUserLean as UserType } from '../user/interfaces/user.interface';

// eslint-disable-next-line @typescript-eslint/naming-convention
export const User = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context).getContext();
    const { headers } = ctx;

    return JSON.parse(headers.user || '{"_id":""}');
  },
);

export type User = UserType;
