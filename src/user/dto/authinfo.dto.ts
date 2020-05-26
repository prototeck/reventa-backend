import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType('AuthInfo', {
  description: 'The Auth Info schema for authentication tokens',
})
export class AuthInfoDTO {
  @Field()
  readonly idToken: string;

  @Field()
  readonly accessToken: string;

  @Field()
  readonly refreshToken: string;
}
