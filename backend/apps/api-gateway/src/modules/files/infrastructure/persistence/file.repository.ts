import { FileType } from '@gateway/modules/files/domain/file';

export abstract class FileRepository {
  abstract create(data: Omit<FileType, 'id'>): Promise<FileType>;
}
