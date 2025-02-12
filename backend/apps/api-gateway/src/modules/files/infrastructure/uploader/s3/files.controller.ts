import { Auth } from '@gateway/decorators';
import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiCreatedResponse } from '@nestjs/swagger';

import { FileResponseDto } from './dto/file-response.dto';
import { FilesS3Service } from './files.service';

@Controller('files')
export class FilesS3Controller {
  constructor(private readonly filesService: FilesS3Service) {}

  @ApiConsumes('multipart/form-data')
  @ApiCreatedResponse({
    type: FileResponseDto,
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @Post('upload')
  @Auth([])
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.MulterS3.File) {
    return this.filesService.create(file);
  }
}
