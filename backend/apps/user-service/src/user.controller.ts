import {
  UsersServiceController,
  CreateUserDto,
  UpdateUserDto,
  UsersServiceControllerMethods,
  FindOneUserDto,
  PaginationDto,
  User,
} from '@app/common';
import { Controller } from '@nestjs/common';
import { Observable } from 'rxjs';

import { UserService } from './user.service';

@Controller()
@UsersServiceControllerMethods()
export class UserController implements UsersServiceController {
  constructor(private readonly userService: UserService) {}

  createUser(createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  findAllUsers() {
    return this.userService.findAll();
  }

  async findOneUser(findOneUserDto: FindOneUserDto): Promise<User | null> {
    const user = await this.userService.findOne(findOneUserDto.id);

    return user && user.toDto();
  }

  updateUser(updateUserDto: UpdateUserDto) {
    return this.userService.update(updateUserDto.id, updateUserDto);
  }

  removeUser(findOneUserDto: FindOneUserDto) {
    return this.userService.remove(findOneUserDto.id);
  }

  queryUsers(paginationDtoStream: Observable<PaginationDto>) {
    return this.userService.queryUsers(paginationDtoStream);
  }
}
