import { Body, Controller, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';

import { SlackBotService } from './slack-bot.service';

@Controller('slack-bot')
export class SlackBotController {
  constructor(private readonly slackBotService: SlackBotService) {}

  @Post('file-upload')
  @UseInterceptors(FilesInterceptor('file'))
  async fileUpload(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() body: Record<string, string>,
  ) {
    return this.slackBotService.sendFilesUploadMessage(files, {
      channelId: body.channelSlack,
      initialComment: body.messageText,
    });
  }
}
