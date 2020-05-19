import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';

import { UserDTO } from './dto/user.dto';
import { CreateUserInput } from './inputs/create-user.input';
import { UserService } from './user.service';
import { ConfirmUserInput } from './inputs/confirm-user.input';

@Resolver(() => UserDTO)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => [UserDTO])
  async users() {
    const users = await this.userService.findAll();

    return users;
  }

  @Mutation(() => UserDTO)
  async createUser(@Args('input') input: CreateUserInput) {
    const user = await this.userService.createUser(input);

    return user;
  }

  @Mutation(() => String)
  async confirmUser(@Args('input') input: ConfirmUserInput) {
    const result = await this.userService.confirmUser(input);

    return result;
  }
}
