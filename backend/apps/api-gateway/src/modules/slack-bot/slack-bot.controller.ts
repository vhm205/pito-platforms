import { AllConfigType } from '@app/common/configs';
import { RoleType } from '@gateway/constants';
import { Auth } from '@gateway/decorators';
import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FilesInterceptor } from '@nestjs/platform-express';
import { isEmpty } from 'lodash';

import { SlackBotService } from './slack-bot.service';

@Controller('slack-bot')
export class SlackBotController {
  constructor(
    private readonly configService: ConfigService<AllConfigType>,
    private readonly slackBotService: SlackBotService,
  ) {}

  @Post('file-upload')
  @Auth([RoleType.OPERATOR])
  @UseInterceptors(FilesInterceptor('file'))
  async fileUpload(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() body: Record<string, string>,
  ) {
    if (isEmpty(files)) {
      throw new BadRequestException('No file uploaded');
    }

    return this.slackBotService.sendFilesUploadMessage(files, {
      channelId: this.configService.get('app.slackChannel.pxPccSocialMedia', { infer: true }),
      initialComment: body.messageText,
    });
  }
}
