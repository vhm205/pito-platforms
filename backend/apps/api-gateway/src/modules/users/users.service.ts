import { USER_SERVICE, USERS_SERVICE_NAME, UsersServiceClient } from '@app/common';
import { Inject, Injectable } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';

@Injectable()
export class UsersService {
  private usersService: UsersServiceClient;

  constructor(@Inject(USER_SERVICE) private client: ClientGrpc) {}

  onModuleInit() {
    this.usersService = this.client.getService<UsersServiceClient>(USERS_SERVICE_NAME);
  }
}
