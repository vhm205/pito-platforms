import { Logger } from '@app/common';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { SentryModule } from '@sentry/nestjs/setup';
import { ClsModule } from 'nestjs-cls';

import { CatchAllErrorInterceptor } from './interceptors/catch-all-error.interceptor';
import { AuthModule } from './modules/auth/auth.module';
import { OrdersModule } from './modules/orders/orders.module';
import { UsersModule } from './modules/users/users.module';
import { WebhookModule } from './modules/webhook/webhook.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    OrdersModule,
    WebhookModule,
    ClsModule.forRoot({
      global: true,
      middleware: {
        mount: true,
      },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    SentryModule.forRoot(),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CatchAllErrorInterceptor,
    },
    {
      provide: Logger,
      useFactory: () => new Logger('APIGateway'),
    },
  ],
  exports: [Logger],
})
export class AppModule {}
