import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';

import { UserDTO } from './dto/user.dto';
import { AuthInfoDTO } from './dto/authinfo.dto';
import { CreateUserInput } from './inputs/create-user.input';
import { UpdateUserInput } from './inputs/update-user.input';
import { UserService } from './user.service';
import { ConfirmUserInput } from './inputs/confirm-user.input';
import { LoginUserInput } from './inputs/login-user.input';

@Resolver(() => UserDTO)
export class UserResolver {
  constructor(private readonly _userService: UserService) {}

  @Query(() => [UserDTO])
  async users() {
    const users = await this._userService.findAll();

    return users;
  }

  @Mutation(() => UserDTO)
  async createUser(@Args('input') input: CreateUserInput) {
    const user = await this._userService.createUser(input);

    return user;
  }

  @Mutation(() => UserDTO)
  async updateUser(
    @Args('id') id: string,
    @Args('input') input: UpdateUserInput,
  ) {
    const updatedUser = await this._userService.updateUser(id, input);

    return updatedUser;
  }

  @Mutation(() => UserDTO)
  async deleteUser(@Args('id') id: string) {
    const deletedUser = await this._userService.deleteUser(id);

    return deletedUser;
  }

  @Mutation(() => String)
  async confirmUser(@Args('input') input: ConfirmUserInput) {
    const result = await this._userService.confirmUser(input);

    return result;
  }

  @Query(() => AuthInfoDTO)
  async signinUser(@Args('input') input: LoginUserInput) {
    const result = await this._userService.loginUser(input);

    return result;
  }
}
