import { join } from 'path';

import { USER_PACKAGE_NAME, USER_SERVICE } from '@app/common';
import { AllConfigType } from '@app/common/configs';
import { CacheModule, CacheStore } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { redisStore } from 'cache-manager-redis-yet';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RoleEntity } from './entities/RoleEntity';
import { UserEntity } from './entities/UserEntity';
import { JwtStrategy } from './jwt.stategy';
import { KeycloakAdminService } from './keycloak-admin.service';
import { PublicStrategy } from './public.stategy';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        imports: [ConfigModule],
        name: USER_SERVICE,
        useFactory: (configService: ConfigService<AllConfigType>) => ({
          transport: Transport.GRPC,
          options: {
            package: USER_PACKAGE_NAME,
            protoPath: join(process.cwd(), 'proto/user.proto'),
            url: configService.get('app.userGrpcUrl', { infer: true }),
          },
        }),
        inject: [ConfigService],
      },
    ]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService<AllConfigType>) => ({
        secret: configService.get('external.supabase.jwtSecret', {
          infer: true,
        }),
        signOptions: {
          algorithm: 'RS256',
        },
        verifyOptions: {
          algorithms: ['RS256'],
        },
      }),
      inject: [ConfigService],
    }),
    CacheModule.registerAsync({
      useFactory: async () => {
        const store = await redisStore({
          socket: {
            host: process.env.REDIS_HOST,
            port: +(process.env.REDIS_PORT as string),
          },
        });

        return {
          store: store as unknown as CacheStore,
        };
      },
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<AllConfigType>) => ({
        type: 'postgres',
        host: configService.getOrThrow<string>('KEYCLOAK_DB_HOST', { infer: true }),
        port: configService.getOrThrow<number>('KEYCLOAK_DB_PORT', { infer: true }),
        username: configService.getOrThrow<string>('KEYCLOAK_DB_USER', { infer: true }),
        password: configService.getOrThrow<string>('KEYCLOAK_DB_PASSWORD', { infer: true }),
        database: configService.getOrThrow<string>('KEYCLOAK_DB_NAME', { infer: true }),
        entities: [UserEntity, RoleEntity],
      }),
    }),
    TypeOrmModule.forFeature([UserEntity, RoleEntity]),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, PublicStrategy, KeycloakAdminService],
  exports: [JwtModule, AuthService],
})
export class AuthModule {}
