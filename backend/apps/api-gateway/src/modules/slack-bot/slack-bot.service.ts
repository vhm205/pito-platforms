import { LoggerService } from '@app/common';
import { AllConfigType } from '@app/common/configs';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WebClient, LogLevel } from '@slack/web-api';

@Injectable()
export class SlackBotService {
  public slackClient: WebClient;

  constructor(
    private readonly logger: LoggerService,
    private readonly configService: ConfigService<AllConfigType>,
  ) {
    this.slackClient = new WebClient(
      this.configService.get('webhook.slackBotToken', { infer: true }),
      {
        logLevel: LogLevel.DEBUG,
      },
    );
  }

  async sendFilesUploadMessage(
    files: Express.Multer.File[],
    options?: {
      channelId?: string;
      initialComment?: string;
    },
  ) {
    const { ok, error } = await this.slackClient.filesUploadV2({
      channel_id: options?.channelId,
      initial_comment: options?.initialComment,
      file_uploads: files.map(file => ({
        file: file.buffer,
        filename: file.originalname,
        filetype: file.mimetype,
      })),
    });

    if (error) {
      this.logger.error(`Error sending file upload message => ${error}`, {
        context: SlackBotService.name,
      });
    }
    return ok;
  }
}
