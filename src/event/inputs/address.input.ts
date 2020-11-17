import { InputType, Field } from '@nestjs/graphql';

/**
 * defines the input schema for event address
 */
@InputType()
export class AddressInput {
  @Field()
  readonly addressLine1!: string;

  @Field({ nullable: true })
  readonly addressLine2?: string;

  @Field()
  readonly city!: string;

  @Field()
  readonly state!: string;

  @Field()
  readonly zipCode!: string;

  @Field()
  readonly country!: string;
}
