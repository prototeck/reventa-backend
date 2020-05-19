import { Injectable } from '@nestjs/common';
import * as AmazonCognitoIdentity from 'amazon-cognito-identity-js';
import * as AWS from 'aws-sdk';

import { IUser } from '../user/interfaces/user.interface';

export type CognitoUserAttribute = AmazonCognitoIdentity.CognitoUserAttribute;

@Injectable()
export class AuthenticationService {
  private poolData;

  private userPool;

  private cognitoAdmin;

  constructor() {
    this.poolData = {
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

    this.userPool = new AmazonCognitoIdentity.CognitoUserPool(this.poolData);

    this.cognitoAdmin = new AWS.CognitoIdentityServiceProvider({
      region: global.config.aws.cognito.poolRegion,
      ...configKeys,
    });
  }

  private makeAttribute = (name: string, value: string): CognitoUserAttribute =>
    new AmazonCognitoIdentity.CognitoUserAttribute({
      Name: name,
      Value: value,
    });

  private signUp(
    userId: string,
    password: string,
    attributeList: CognitoUserAttribute[],
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.userPool.signUp(userId, password, attributeList, null, error => {
        if (error) {
          return reject(error);
        }

        return resolve(true);
      });
    });
  }

  private confirmRegistration(userId: string, code: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const userData = {
        Username: userId,
        Pool: this.userPool,
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

  public userSignup(user: IUser, password: string) {
    return new Promise((resolve, reject) => {
      const attributeList: CognitoUserAttribute[] = [];

      const name = `${user.firstName} ${user.lastName}`;

      attributeList.push(this.makeAttribute('email', user.email));
      attributeList.push(this.makeAttribute('name', name));

      // eslint-disable-next-line no-underscore-dangle
      this.signUp(user._id, password, attributeList)
        .then(resolve)
        .catch(reject);
    });
  }

  public confirmCode(user: IUser, code: string) {
    // eslint-disable-next-line no-underscore-dangle
    return this.confirmRegistration(user._id, code);
  }
}
