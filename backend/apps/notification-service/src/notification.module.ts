import { CUSTOMER_DB_SOURCE, LoggerModule } from '@app/common';
import {
  AllConfigType,
  appConfig,
  databaseConfig,
  Environment,
  externalConfig,
} from '@app/common/configs';
import { CatchAllErrorInterceptor } from '@app/common/interceptors';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';

import { NotificationEntity } from './infrastructure/persistence/relational/entities/notification.entity';
import { RelationalNotificationPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      load: [externalConfig, databaseConfig, appConfig],
    }),
    LoggerModule.forRoot({
      service: NotificationService.name,
    }),
    TypeOrmModule.forRootAsync({
      name: CUSTOMER_DB_SOURCE,
      inject: [ConfigService],
      useFactory: (configService: ConfigService<AllConfigType>) => ({
        type: 'postgres',
        host: configService.getOrThrow('database.host', { infer: true }),
        port: configService.getOrThrow('database.port', { infer: true }),
        username: configService.getOrThrow('database.username', { infer: true }),
        password: configService.getOrThrow('database.password', { infer: true }),
        database: configService.getOrThrow('database.name', { infer: true }),
        logging:
          configService.getOrThrow('app.nodeEnv', { infer: true }) !== Environment.PRODUCTION,
        entities: [NotificationEntity],
      }),
    }),
    RelationalNotificationPersistenceModule,
  ],
  controllers: [NotificationController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CatchAllErrorInterceptor,
    },
    NotificationService,
  ],
})
export class NotificationModule {}
