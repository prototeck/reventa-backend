import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import {
  CognitoIdToken,
  CognitoAccessToken,
  CognitoRefreshToken,
  CognitoUserSession,
} from 'amazon-cognito-identity-js';
import jwt from 'jwt-decode';

import { UserService } from '../user/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject('UserService') private readonly _userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context).getContext();
    const { headers } = ctx;
    const { request } = ctx;
    const { idtoken, accesstoken, refreshtoken } = headers;

    if (idtoken && accesstoken && refreshtoken) {
      const decoded = jwt(idtoken);
      const username = decoded['cognito:username'];

      const idToken = new CognitoIdToken({
        IdToken: idtoken,
      });

      const accessToken = new CognitoAccessToken({
        AccessToken: accesstoken,
      });

      const refreshToken = new CognitoRefreshToken({
        RefreshToken: refreshtoken,
      });

      const tokenData = {
        IdToken: idToken,
        RefreshToken: refreshToken,
        AccessToken: accessToken,
      };

      const session = new CognitoUserSession(tokenData);

      if (session.isValid()) {
        const user = await this._userService.findOne(username);

        if (!user) {
          throw new HttpException('user not found', HttpStatus.NOT_FOUND);
        }

        request.headers.user = JSON.stringify(user);

        return true;
      }

      return false;
    }

    return false;
  }
}
