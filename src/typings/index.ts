export type Mutable<T> = { -readonly [P in keyof T]: T[P] };

export interface IConfig {
  mongo: {
    uri: string;
    dbname: string;
  };
  aws: {
    common: {
      region: string;
      accessKeyId: string;
      secretAccessKey: string;
    };
    cognito: {
      poolRegion: string;
      poolId: string;
      clientId: string;
    };
  };
}

export * from './user';
