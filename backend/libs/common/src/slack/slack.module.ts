import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { webhookConfig } from '../configs';
import { LoggerModule } from '../logger';

import { SlackService } from './slack.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      load: [webhookConfig],
    }),
    LoggerModule.forRoot({
      service: SlackModule.name,
    }),
  ],
  providers: [SlackService],
  exports: [SlackService],
})
export class SlackModule {}
