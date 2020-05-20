import { ObjectType, Field, ID, Float } from '@nestjs/graphql';

@ObjectType('User', { description: 'The User model' })
export class LoginUserDTO {

    @Field(() => ID)
    readonly idToken: string;

    @Field()
    readonly accessToken: string;

    @Field(() => Float)
    readonly refreshToken: string;
}
