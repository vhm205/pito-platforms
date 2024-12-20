import { registerAs } from '@nestjs/config';
import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';

import { validateConfig } from './validate-config';

export enum Environment {
  DEVELOPMENT = 'development',
  PRODUCTION = 'production',
  TEST = 'test',
}

export type AppConfig = {
  nodeEnv: Environment;
  apiGatewayPort: number;

  userGrpcUrl: string;
  orderGrpcUrl: string;
  billingGrpcUrl: string;
  menuGrpcUrl: string;

  rabbitmqHost: string;
  rabbitmqPort: number;
  rabbitmqUser: string;
  rabbitmqPass: string;
  rabbitmqVhost: string;

  defaultDistanceInMeters: number;
  customerClientUrl: string;
};

class AppVariablesValidator {
  @IsEnum(Environment)
  @IsOptional()
  NODE_ENV: Environment;

  @IsInt()
  @IsOptional()
  API_GATEWAY_PORT: number;

  @IsString()
  USER_GRPC_HOST: string;

  @IsInt()
  USER_GRPC_PORT: number;

  @IsString()
  ORDER_GRPC_HOST: string;

  @IsInt()
  ORDER_GRPC_PORT: number;

  @IsString()
  BILLING_GRPC_HOST: string;

  @IsInt()
  BILLING_GRPC_PORT: number;

  @IsString()
  MENU_GRPC_HOST: string;

  @IsInt()
  MENU_GRPC_PORT: number;

  @IsString()
  RABBITMQ_HOST: string;

  @IsInt()
  RABBITMQ_PORT: number;

  @IsString()
  RABBITMQ_USER: string;

  @IsString()
  RABBITMQ_PASS: string;

  @IsString()
  RABBITMQ_VHOST: string;

  @IsInt()
  DEFAULT_DISTANCE_IN_METERS: number;

  @IsString()
  CUSTOMER_CLIENT_URL: string;
}

// eslint-disable-next-line import/no-default-export
export default registerAs<AppConfig>('app', () => {
  validateConfig(process.env, AppVariablesValidator);

  return {
    nodeEnv: (process.env.NODE_ENV! as Environment) ?? Environment.DEVELOPMENT,
    apiGatewayPort: process.env.API_GATEWAY_PORT
      ? parseInt(process.env.API_GATEWAY_PORT, 10)
      : 3000,

    userGrpcUrl: process.env.USER_GRPC_HOST!.concat(':', process.env.USER_GRPC_PORT!),
    orderGrpcUrl: process.env.ORDER_GRPC_HOST!.concat(':', process.env.ORDER_GRPC_PORT!),
    billingGrpcUrl: process.env.BILLING_GRPC_HOST!.concat(':', process.env.BILLING_GRPC_PORT!),
    menuGrpcUrl: process.env.MENU_GRPC_HOST!.concat(':', process.env.MENU_GRPC_PORT!),

    rabbitmqHost: process.env.RABBITMQ_HOST!,
    rabbitmqPort: process.env.RABBITMQ_PORT ? parseInt(process.env.RABBITMQ_PORT, 10) : 5672,
    rabbitmqUser: process.env.RABBITMQ_USER!,
    rabbitmqPass: process.env.RABBITMQ_PASS!,
    rabbitmqVhost: process.env.RABBITMQ_VHOST!,

    defaultDistanceInMeters: +process.env.DEFAULT_DISTANCE_IN_METERS!,
    customerClientUrl: process.env.CUSTOMER_CLIENT_URL!,
  };
});
