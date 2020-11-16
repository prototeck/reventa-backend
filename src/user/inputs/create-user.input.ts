import { InputType, Field } from '@nestjs/graphql';
import { IsAlpha, IsEmail } from 'class-validator';

/**
 * * defines the input schema for user creation
 */
@InputType()
export class CreateUserInput {
  /** user's first name - an all alphabet string */
  @Field()
  @IsAlpha()
  readonly firstName!: string;

  /** user's last name - an all alphabet string */
  @Field()
  @IsAlpha()
  readonly lastName!: string;

  /** user's email address - a valid email address */
  @Field()
  @IsEmail()
  readonly email!: string;

  /** user's password - any string */
  @Field()
  readonly password!: string;
}
