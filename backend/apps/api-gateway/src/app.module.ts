import { LoggerModule } from '@app/common';
import { appConfig, databaseConfig, externalConfig, fileConfig } from '@app/common/configs';
import { MenusModule } from '@gateway/modules/menus/menus.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { SentryModule } from '@sentry/nestjs/setup';
import { ClsModule } from 'nestjs-cls';

import { CatchAllErrorInterceptor } from './interceptors/catch-all-error.interceptor';
import { TransformResponseInterceptor } from './interceptors/transform-response.interceptor';
import { AuthModule } from './modules/auth/auth.module';
import { FilesModule } from './modules/files/files.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { OrdersModule } from './modules/orders/orders.module';
import { StoresModule } from './modules/stores/stores.module';
import { UsersModule } from './modules/users/users.module';
import { WebhookModule } from './modules/webhook/webhook.module';

const modules = [
  AuthModule,
  MenusModule,
  FilesModule,
  OrdersModule,
  StoresModule,
  UsersModule,
  WebhookModule,
  NotificationsModule,
];

@Module({
  imports: [
    ClsModule.forRoot({
      global: true,
      middleware: {
        mount: true,
      },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      load: [appConfig, databaseConfig, externalConfig, fileConfig],
    }),
    SentryModule.forRoot(),
    LoggerModule.forRoot({
      service: 'ApiGateway',
    }),
    ...modules,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CatchAllErrorInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformResponseInterceptor,
    },
  ],
})
export class AppModule {}
