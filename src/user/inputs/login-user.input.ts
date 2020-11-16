import { InputType, Field } from '@nestjs/graphql';
import { IsEmail } from 'class-validator';

/**
 * * defines the input schema for user login
 */
@InputType()
export class LoginUserInput {
  /** user's email address - a valid email address */
  @Field()
  @IsEmail()
  readonly email!: string;

  /** user's password  */
  @Field()
  readonly password!: string;
}
