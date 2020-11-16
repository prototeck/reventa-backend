import { ObjectType, Field } from '@nestjs/graphql';

/**
 * defines the dto schema for event address
 */
@ObjectType('Address')
export class AddressDTO {
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
