import { join } from 'path';

import { ORDER_PACKAGE_NAME, ORDER_SERVICE } from '@app/common';
import { AllConfigType } from '@app/common/configs';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { AuthModule } from '../auth/auth.module';

import { AhamoveWebhookController } from './controllers';
import { SupabaseWebhookController } from './controllers/supabase.controller';
import { OrderEventsService } from './services';
import { TransformerModule } from './transfomers';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: ORDER_SERVICE,
        inject: [ConfigService],
        useFactory: (configService: ConfigService<AllConfigType>) => ({
          transport: Transport.GRPC,
          options: {
            package: ORDER_PACKAGE_NAME,
            protoPath: join(process.cwd(), 'proto/order.proto'),
            url: configService.get('app.orderGrpcUrl', { infer: true }),
          },
        }),
      },
    ]),
    TransformerModule,
    AuthModule,
  ],
  controllers: [AhamoveWebhookController, SupabaseWebhookController],
  providers: [OrderEventsService],
  exports: [OrderEventsService],
})
export class WebhookModule {}
