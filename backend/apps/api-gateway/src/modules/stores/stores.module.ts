import { join } from 'path';

import { MENU_PACKAGE_NAME, MENU_SERVICE } from '@app/common';
import { AllConfigType } from '@app/common/configs';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { OperatorStoresController } from './operator-stores.controller';
import { OperatorStoresService } from './operator-stores.service';
import { StoresController } from './stores.controller';
import { StoresService } from './stores.service';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        imports: [ConfigModule],
        name: MENU_SERVICE,
        useFactory: (configService: ConfigService<AllConfigType>) => ({
          transport: Transport.GRPC,
          options: {
            package: MENU_PACKAGE_NAME,
            protoPath: join(process.cwd(), 'proto/menu.proto'),
            url: configService.get('app.menuGrpcUrl', { infer: true }),
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [StoresController, OperatorStoresController],
  providers: [StoresService, OperatorStoresService],
})
export class StoresModule {}
