import { HttpException, HttpStatus } from '@nestjs/common';

export const makeError = (error: any): HttpException => {
  if (error instanceof HttpException) {
    return error;
  }

  return new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
};

export const corsConfig = {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  allowedHeaders: 'Content-Type, Accept',
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
