import { InputType, Field } from '@nestjs/graphql';

/**
 * * defines the input schema for user login
 */
@InputType()
export class LoginUserInput {
  /** user's email address - a valid email address */
  @Field()
  readonly email!: string;

  /** user's password  */
  @Field()
  readonly password!: string;
}
