import { InputType, Field } from '@nestjs/graphql';

/**
 * * defines the input schema for user confirmation
 */
@InputType()
export class ConfirmUserInput {
  /** user's email address - a valid email address */
  @Field()
  readonly email!: string;

  /** verification code received on email to confirm the user - any string */
  @Field()
  readonly code!: string;
}
