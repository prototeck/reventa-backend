import { HttpException, HttpStatus } from '@nestjs/common';
import { object, SchemaMap } from 'joi';

export const makeError = (error: any): HttpException => {
  if (error instanceof HttpException) {
    return error;
  }

  return new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
};

export const corsConfig = {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  allowedHeaders: 'Content-Type, Accept, idToken, accessToken, refreshToken',
  credentials: true,
};

export function prepareSubdocumentUpdate(input, basePath: string) {
  const subdocumentUpdate = Object.entries(input).reduce(
    (memo, [key, value]) => ({
      ...memo,
      [`${basePath}${'.$.'}${key}`]: value,
    }),
    {},
  );

  return subdocumentUpdate;
}

export const joiValidate = <T>(schema: SchemaMap<T>) => {
  const objectSchema = object<T>(schema);

  return (value: any) => {
    const response = objectSchema.validate(value);

    if (response.error) {
      throw new HttpException(response.error.message, HttpStatus.BAD_REQUEST);
    }

    return response;
  };
};
