import { ObjectType, Field, ID, Float } from '@nestjs/graphql';

@ObjectType('User', { description: 'The User model' })
export class UserDTO {
  @Field(() => ID)
  // tslint:disable-next-line: variable-name
  readonly _id!: string;

  @Field()
  readonly firstName!: string;

  @Field()
  readonly lastName!: string;

  @Field()
  readonly email!: string;

  @Field(() => Float)
  readonly createdOn!: string;
}
