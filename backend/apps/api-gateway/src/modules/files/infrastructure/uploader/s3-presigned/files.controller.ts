import { Body, Controller, Post } from '@nestjs/common';
import { FilesS3PresignedService } from './files.service';
import { FileUploadDto } from './dto/file.dto';

@Controller('files')
export class FilesS3PresignedController {
  constructor(private readonly filesService: FilesS3PresignedService) {}

  @Post('upload')
  async uploadFile(@Body() file: FileUploadDto) {
    return this.filesService.create(file);
  }
}
