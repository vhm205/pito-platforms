import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { FilesS3Service } from './files.service';

@Controller('files')
export class FilesS3Controller {
  constructor(private readonly filesService: FilesS3Service) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.MulterS3.File) {
    return this.filesService.create(file);
  }
}
