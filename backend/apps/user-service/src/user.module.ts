import { CUSTOMER_DB_SOURCE, LoggerModule, PARTNER_DB_SOURCE } from '@app/common';
import { AllConfigType, appConfig, databaseConfig, Environment } from '@app/common/configs';
import { GlobalRpcExceptionFilter } from '@app/common/filters';
import { CamelCaseResponseInterceptor } from '@app/common/interceptors';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CompanyEntity } from './infrastructure/persistence/relational/entities/company.entity';
import { CustomerEntity } from './infrastructure/persistence/relational/entities/customer.entity';
import { OperatorEntity } from './infrastructure/persistence/relational/entities/operator.entity';
import { PartnerUserRelationship } from './infrastructure/persistence/relational/entities/partner-user-relationship.entity';
import { PartnerEntity } from './infrastructure/persistence/relational/entities/partner.entity';
import { PermissionEntity } from './infrastructure/persistence/relational/entities/permission.entity';
import { RolePermissionEntity } from './infrastructure/persistence/relational/entities/role-permission.entity';
import { RoleEntity } from './infrastructure/persistence/relational/entities/role.entity';
import { StoreUserRelationship } from './infrastructure/persistence/relational/entities/store-user-relationship.entity';
import { UserCustomerEntity } from './infrastructure/persistence/relational/entities/user-customer.entity';
import { UserPartnerEntity } from './infrastructure/persistence/relational/entities/user-partner.entity';
import { UserRoleEntity } from './infrastructure/persistence/relational/entities/user-role.entity';
import { RelationalUserPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      load: [appConfig, databaseConfig],
    }),
    LoggerModule.forRoot({
      service: UserService.name,
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
        logging: configService.get('app.nodeEnv', { infer: true }) !== Environment.PRODUCTION,
        entities: [OperatorEntity, CustomerEntity, UserCustomerEntity, CompanyEntity],
      }),
    }),
    TypeOrmModule.forRootAsync({
      name: PARTNER_DB_SOURCE,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.getOrThrow<string>('PARTNER_DB_HOST', { infer: true }),
        port: configService.getOrThrow<number>('PARTNER_DB_PORT', { infer: true }),
        username: configService.getOrThrow<string>('PARTNER_DB_USER', { infer: true }),
        password: configService.getOrThrow<string>('PARTNER_DB_PASSWORD', { infer: true }),
        database: configService.getOrThrow<string>('PARTNER_DB_NAME', { infer: true }),
        logging: configService.get('app.nodeEnv', { infer: true }) !== Environment.PRODUCTION,
        entities: [
          PartnerEntity,
          UserPartnerEntity,
          UserRoleEntity,
          RoleEntity,
          RolePermissionEntity,
          PermissionEntity,
          PartnerUserRelationship,
          StoreUserRelationship,
        ],
      }),
    }),
    RelationalUserPersistenceModule,
  ],
  controllers: [UserController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: GlobalRpcExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: CamelCaseResponseInterceptor,
    },
    UserService,
  ],
})
export class UserModule {}
