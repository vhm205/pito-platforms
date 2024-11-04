import { registerAs } from '@nestjs/config';
import { validateConfig } from './validate-config';
import { IsString } from 'class-validator';

export type ExternalConfig = {
  sentry: {
    dsn: string;
  };
  supabase: {
    url: string;
    anonKey: string;
    serviceRoleKey: string;
    jwtSecret: string;
  };
  ahamove: {
    apiKey: string;
    serviceId: string;
    systemToken: string;
    orderEventsApiKey: string;
  };
};

class ExternalVariablesValidator {
  @IsString()
  SENTRY_DSN: string;

  @IsString()
  SUPABASE_URL: string;

  @IsString()
  SUPABASE_ANON_KEY: string;

  @IsString()
  SUPABASE_SERVICE_ROLE_KEY: string;

  @IsString()
  SUPABASE_JWT_SECRET: string;

  @IsString()
  AHAMOVE_API_KEY: string;

  @IsString()
  AHAMOVE_SERVICE_ID: string;

  @IsString()
  AHAMOVE_SYSTEM_TOKEN: string;

  @IsString()
  AHAMOVE_ORDER_EVENTS_API_KEY: string;
}

export default registerAs<ExternalConfig>('external', () => {
  validateConfig(process.env, ExternalVariablesValidator);

  return {
    sentry: {
      dsn: process.env.SENTRY_DSN,
    },
    supabase: {
      url: process.env.SUPABASE_URL,
      anonKey: process.env.SUPABASE_ANON_KEY,
      serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
      jwtSecret: process.env.SUPABASE_JWT_SECRET,
    },
    ahamove: {
      apiKey: process.env.AHAMOVE_API_KEY,
      serviceId: process.env.AHAMOVE_SERVICE_ID,
      systemToken: process.env.AHAMOVE_SYSTEM_TOKEN,
      orderEventsApiKey: process.env.AHAMOVE_ORDER_EVENTS_API_KEY,
    },
  };
});
