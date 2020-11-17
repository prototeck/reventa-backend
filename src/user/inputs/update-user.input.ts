import { InputType, Field } from '@nestjs/graphql';

/**
 * * defines the input schema for user updation
 */
@InputType()
export class UpdateUserInput {
  /** user's first name */
  @Field({ nullable: true })
  readonly firstName?: string;

  /** user's last name */
  @Field({ nullable: true })
  readonly lastName?: string;
}
