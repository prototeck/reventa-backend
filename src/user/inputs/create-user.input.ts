import { InputType, Field } from '@nestjs/graphql';

/**
 * * defines the input schema for user creation
 */
@InputType()
export class CreateUserInput {
  /** user's first name - an all alphabet string */
  @Field()
  readonly firstName!: string;

  /** user's last name - an all alphabet string */
  @Field()
  readonly lastName!: string;

  /** user's email address - a valid email address */
  @Field()
  readonly email!: string;

  /** user's password - any string */
  @Field()
  readonly password!: string;
}
