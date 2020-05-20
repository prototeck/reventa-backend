import { ObjectType, Field, ID, Float } from '@nestjs/graphql';

@ObjectType('LoginUser', { description: 'The LoginUser model' })
export class AuthInfoDTO {
    @Field(() => ID)
    readonly idToken: string;

    @Field()
    readonly accessToken: string;

    @Field(() => Float)
    readonly refreshToken: string;
}
