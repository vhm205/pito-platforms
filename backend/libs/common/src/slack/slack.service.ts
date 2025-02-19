import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LogLevel, WebClient, ChatPostMessageArguments } from '@slack/web-api';

import { AllConfigType } from '../configs';
import { LoggerService } from '../logger';

import { SlackMessage, BlockSection } from './slack.interface';

@Injectable()
export class SlackService {
  public slackClient: WebClient;

  constructor(
    private readonly logger: LoggerService,
    private readonly configService: ConfigService<AllConfigType>,
  ) {
    const token = this.configService.get('webhook.slackBotToken', { infer: true });

    this.slackClient = new WebClient(token, {
      logLevel: LogLevel.DEBUG,
    });
  }

  async sendMessage(
    channel: string,
    payload: SlackMessage,
    options?: {
      reply_broadcast: boolean;
      thread_ts?: string;
    },
  ) {
    const args: ChatPostMessageArguments = options?.thread_ts
      ? {
          channel,
          text: payload?.text as string,
          blocks: payload?.blocks as BlockSection[],
          thread_ts: options.thread_ts,
          reply_broadcast: options.reply_broadcast ?? false,
        }
      : {
          channel,
          text: payload?.text as string,
          blocks: payload?.blocks as BlockSection[],
        };

    const { error, ...response } = await this.slackClient.chat.postMessage(args);

    if (error) {
      this.logger.error(`Error sending message => ${error}`, {
        context: SlackService.name,
      });
    }

    return response;
  }
}
