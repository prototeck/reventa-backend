export type Mutable<T> = { -readonly [P in keyof T]: T[P] };

export interface Config {
  mongo: {
    uri: string;
    dbname: string;
  };
}
