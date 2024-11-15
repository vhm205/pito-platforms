import { FileType } from '@gateway/modules/files/domain/file';
import { FileRepository } from '@gateway/modules/files/infrastructure/persistence/file.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FileRelationalRepository implements FileRepository {
  create(data: Omit<FileType, 'id'>): Promise<FileType> {
    // console.log('Creating file in relational database');
    return Promise.resolve({ id: '1', ...data });
  }
}
