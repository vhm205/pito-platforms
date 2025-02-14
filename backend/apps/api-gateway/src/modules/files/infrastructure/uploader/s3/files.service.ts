import { FileType } from '@gateway/modules/files/domain/file';
import { FileRepository } from '@gateway/modules/files/infrastructure/persistence/file.repository';
import { HttpStatus, Injectable, UnprocessableEntityException } from '@nestjs/common';

@Injectable()
export class FilesS3Service {
  constructor(private readonly fileRepository: FileRepository) {}

  async create(file: Express.MulterS3.File): Promise<{ file: FileType }> {
    if (!file) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          file: 'selectFile',
        },
      });
    }

    const fileUploaded = await this.fileRepository.create({ path: file.key });

    fileUploaded.path = file.location; // TODO: need to remove this line in the future
    fileUploaded.fullPath = file.location;

    return {
      file: fileUploaded,
    };
  }
}
