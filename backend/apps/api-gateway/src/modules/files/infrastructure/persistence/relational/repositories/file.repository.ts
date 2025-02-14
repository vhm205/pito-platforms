import { NullableType } from '@app/common/types/common';
import { FileType } from '@gateway/modules/files/domain/file';
import { FileRepository } from '@gateway/modules/files/infrastructure/persistence/file.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FileRelationalRepository implements FileRepository {
  constructor() {}

  create(data: FileType): Promise<FileType> {
    return Promise.resolve(data);
  }

  findById(_id: FileType['id']): Promise<NullableType<FileType>> {
    return Promise.resolve(null);
  }

  findByIds(_ids: FileType['id'][]): Promise<FileType[]> {
    return Promise.resolve([]);
  }
}
