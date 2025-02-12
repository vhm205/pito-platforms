import { NullableType } from '@app/common/types/common';
import { FileType } from '@gateway/modules/files/domain/file';

export abstract class FileRepository {
  abstract create(data: Omit<FileType, 'id' | 'fullPath'>): Promise<FileType>;
  abstract findById(id: FileType['id']): Promise<NullableType<FileType>>;
  abstract findByIds(ids: FileType['id'][]): Promise<FileType[]>;
}
