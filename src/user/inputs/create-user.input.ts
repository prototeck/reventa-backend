import { InputType, Field } from '@nestjs/graphql';
import { IsAlpha, IsEmail } from 'class-validator';

/**
 * * defines the input schema for user creation
 */
@InputType()
export class CreateUserInput {
  /** user's first name */
  @Field()
  @IsAlpha()
  readonly firstName: string;

  /** user's last name */
  @Field()
  @IsAlpha()
  readonly lastName: string;

  /** user's email address */
  @Field()
  @IsEmail()
  readonly email: string;
}
