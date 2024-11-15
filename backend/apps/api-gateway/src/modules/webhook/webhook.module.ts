import { join } from 'path';

import { ORDER_PACKAGE_NAME, ORDER_SERVICE } from '@app/common';
import { AllConfigType } from '@app/common/configs';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { AhamoveWebhookController } from './controllers';
import { OrderEventsService } from './services';
import { TransformerModule } from './transfomers';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        imports: [ConfigModule],
        name: ORDER_SERVICE,
        useFactory: (configService: ConfigService<AllConfigType>) => ({
          transport: Transport.GRPC,
          options: {
            package: ORDER_PACKAGE_NAME,
            protoPath: join(process.cwd(), 'proto/order.proto'),
            url: configService.get('app.orderGrpcUrl', { infer: true }),
          },
        }),
        inject: [ConfigService],
      },
    ]),
    TransformerModule,
  ],
  controllers: [AhamoveWebhookController],
  providers: [OrderEventsService],
  exports: [OrderEventsService],
})
export class WebhookModule {}
