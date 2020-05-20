import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';

import { UserDTO } from './dto/user.dto';
import { LoginUserDTO } from './dto/loginUser.dto';
import { CreateUserInput } from './inputs/create-user.input';
import { UpdateUserInput } from './inputs/update-user.input';
import { UserService } from './user.service';
import { ConfirmUserInput } from './inputs/confirm-user.input';
import { LoginUserInput } from './inputs/login-user.input';

@Resolver(() => UserDTO)
export class UserResolver {
  constructor(private readonly userService: UserService) { }

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

  @Mutation(() => UserDTO)
  async updateUser(
    @Args('id') id: string,
    @Args('input') input: UpdateUserInput,
  ) {
    const updatedUser = await this.userService.updateUser(id, input);

    return updatedUser;
  }

  @Mutation(() => UserDTO)
  async deleteUser(@Args('id') id: string) {
    const deletedUser = await this.userService.deleteUser(id);

    return deletedUser;
  }

  @Mutation(() => String)
  async confirmUser(@Args('input') input: ConfirmUserInput) {
    const result = await this.userService.confirmUser(input);

    return result;
  }

  @Mutation(() => LoginUserDTO)
  async signinUser(@Args('input') input: LoginUserInput) {
    const result = await this.userService.loginUser(input);
    console.log('result login', result)
    return result;
  }
}
