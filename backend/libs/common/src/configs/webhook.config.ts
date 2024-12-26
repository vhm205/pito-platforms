import { registerAs } from '@nestjs/config';
import { IsString } from 'class-validator';

import { validateConfig } from './validate-config';

export type WebhookConfig = {
  postgresqlTrigger: string;
  orderEventsApiKey: string;
};

class WebhookVariablesValidator {
  @IsString()
  POSTGRESQL_TRIGGER: string;

  @IsString()
  AHAMOVE_ORDER_EVENTS_API_KEY: string;
}

// eslint-disable-next-line import/no-default-export
export default registerAs<WebhookConfig>('webhook', () => {
  validateConfig(process.env, WebhookVariablesValidator);

  return {
    postgresqlTrigger: process.env.POSTGRESQL_TRIGGER!,
    orderEventsApiKey: process.env.AHAMOVE_ORDER_EVENTS_API_KEY!,
  };
});
