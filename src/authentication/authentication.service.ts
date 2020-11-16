import { Injectable } from '@nestjs/common';
import * as AmazonCognitoIdentity from 'amazon-cognito-identity-js';
import * as AWS from 'aws-sdk';

import { IUserLean, IAuthInfo } from '@typings/index';

export type CognitoUserAttribute = AmazonCognitoIdentity.CognitoUserAttribute;

@Injectable()
export class AuthenticationService {
  private _poolData: AmazonCognitoIdentity.ICognitoUserPoolData;

  private _userPool: AmazonCognitoIdentity.CognitoUserPool;

  private _cognitoAdmin: AWS.CognitoIdentityServiceProvider;

  constructor() {
    this._poolData = {
      UserPoolId: global.config.aws.cognito.poolId,
      ClientId: global.config.aws.cognito.clientId,
    };

    let configKeys = {};

    if (
      global.config.aws.common &&
      global.config.aws.common.accessKeyId &&
      global.config.aws.common.secretAccessKey
    ) {
      configKeys = {
        accessKeyId: global.config.aws.common.accessKeyId,
        secretAccessKey: global.config.aws.common.secretAccessKey,
      };
    }

    this._userPool = new AmazonCognitoIdentity.CognitoUserPool(this._poolData);

    this._cognitoAdmin = new AWS.CognitoIdentityServiceProvider({
      region: global.config.aws.cognito.poolRegion,
      ...configKeys,
    });
  }

  private _makeAttribute = (
    name: string,
    value: string,
  ): CognitoUserAttribute =>
    new AmazonCognitoIdentity.CognitoUserAttribute({
      Name: name,
      Value: value,
    });

  private _signUp(
    userId: string,
    password: string,
    attributeList: CognitoUserAttribute[],
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this._userPool.signUp(userId, password, attributeList, [], error => {
        if (error) {
          return reject(error);
        }

        return resolve(true);
      });
    });
  }

  private _signIn(userId: string, password: string): Promise<IAuthInfo> {
    return new Promise((resolve, reject) => {
      const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(
        {
          Username: userId,
          Password: password,
        },
      );

      const userData = {
        Username: userId,
        Pool: this._userPool,
      };

      const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess(result) {
          const tokens = {
            idToken: result.getIdToken().getJwtToken(),
            accessToken: result.getAccessToken().getJwtToken(),
            refreshToken: result.getRefreshToken().getToken(),
          };

          return resolve(tokens);
        },
        onFailure(error) {
          return reject(new Error(error.message || JSON.stringify(error)));
        },
      });
    });
  }

  private _confirmRegistration(userId: string, code: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const userData = {
        Username: userId,
        Pool: this._userPool,
      };

      const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

      cognitoUser.confirmRegistration(code, true, (error, result) => {
        if (error) {
          return reject(new Error(error.message || JSON.stringify(error)));
        }

        return resolve(result);
      });
    });
  }

  public userSignup(user: IUserLean, password: string) {
    return new Promise((resolve, reject) => {
      const attributeList: CognitoUserAttribute[] = [];

      const name = `${user.firstName} ${user.lastName}`;

      attributeList.push(this._makeAttribute('email', user.email));
      attributeList.push(this._makeAttribute('name', name));

      this._signUp(user._id, password, attributeList)
        .then(resolve)
        .catch(reject);
    });
  }

  public userSignin(user: IUserLean, password: string): Promise<IAuthInfo> {
    return new Promise((resolve, reject) => {
      this._signIn(user._id, password)
        .then(resolve)
        .catch(reject);
    });
  }

  public confirmCode(user: IUserLean, code: string) {
    return this._confirmRegistration(user._id, code);
  }
}
