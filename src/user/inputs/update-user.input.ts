import { InputType, Field } from '@nestjs/graphql';
import { IsAlpha, IsEmail } from 'class-validator';

/**
 * * defines the input schema for user updation
 */
@InputType()
export class UpdateUserInput {
    /** user's first name */
    @Field({ nullable: true })
    @IsAlpha()
    readonly firstName?: string;

    /** user's last name */
    @Field({ nullable: true })
    @IsAlpha()
    readonly lastName?: string;
}
