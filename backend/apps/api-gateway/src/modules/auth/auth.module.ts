import { join } from 'path';

import { USER_PACKAGE_NAME, USER_SERVICE } from '@app/common';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PassportModule } from '@nestjs/passport';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.stategy';
import { PublicStrategy } from './public.stategy';
import { AllConfigType } from '@app/common/configs';

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
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, PublicStrategy],
  exports: [JwtModule, AuthService],
})
export class AuthModule {}
