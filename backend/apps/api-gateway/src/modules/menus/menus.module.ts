import { join } from 'path';

import { MENU_PACKAGE_NAME, MENU_SERVICE } from '@app/common';
import { AllConfigType } from '@app/common/configs';
import { MenusController } from '@gateway/modules/menus/menus.controller';
import { MenusService } from '@gateway/modules/menus/menus.service';
import { OperatorMenusController } from '@gateway/modules/menus/operator-menus.controller';
import { OperatorMenusService } from '@gateway/modules/menus/operator-menus.service';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

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
  controllers: [MenusController, OperatorMenusController],
  providers: [MenusService, OperatorMenusService],
})
export class MenusModule {}
