import { Module } from '@nestjs/common';

import { TransformerModule } from './transfomers';
import { AhamoveWebhookController } from './controllers';
import { OrderEventsService } from './services';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ORDER_PACKAGE_NAME, ORDER_SERVICE } from '@app/common';
import { join } from 'path';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AllConfigType } from '@app/common/configs';

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
