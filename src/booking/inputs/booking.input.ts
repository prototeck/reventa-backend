import { InputType, Field } from '@nestjs/graphql';

/**
 * defines the input schema for booking cancellation
 */
@InputType()
export class BookingInput {
  @Field()
  readonly cancellationReason: string;
}
