import { USER_SERVICE, USER_PACKAGE_NAME } from '@app/common';
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import * as dotenv from 'dotenv';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';

dotenv.config();

@Module({
  imports: [
    ClientsModule.register([
      {
        name: USER_SERVICE,
        transport: Transport.GRPC,
        options: {
          package: USER_PACKAGE_NAME,
          protoPath: './proto/user.proto',
          url: `${process.env.USER_GRPC_HOST}:${process.env.USER_GRPC_PORT}`,
        },
      },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
