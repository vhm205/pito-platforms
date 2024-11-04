import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import {
  HttpStatus,
  Injectable,
  PayloadTooLargeException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { FileRepository } from '@gateway/modules/files/infrastructure/persistence/file.repository';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from '@app/common/configs';
import { FileType } from '@gateway/modules/files/domain/file';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { FileUploadDto } from './dto/file.dto';

@Injectable()
export class FilesS3PresignedService {
  private s3: S3Client;

  constructor(
    private readonly configService: ConfigService<AllConfigType>,
    private readonly fileRepository: FileRepository,
  ) {
    this.s3 = new S3Client({
      region: this.configService.get('file.awsS3Region', { infer: true }),
      credentials: {
        accessKeyId: configService.get('file.accessKeyId', { infer: true }),
        secretAccessKey: configService.get('file.secretAccessKey', { infer: true }),
      },
    });
  }

  async create(file: FileUploadDto): Promise<{ file: FileType; uploadSignedUrl: string }> {
    if (!file) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          file: 'selectFile',
        },
      });
    }
    if (!file.fileName.match(/\.(jpg|jpeg|png|gif)$/i)) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          file: `cantUploadFileType`,
        },
      });
    }

    const maxFileSize = this.configService.get('file.maxFileSize', { infer: true });
    if (file.fileSize > maxFileSize) {
      throw new PayloadTooLargeException({
        statusCode: HttpStatus.PAYLOAD_TOO_LARGE,
        error: 'Payload Too Large',
        message: 'File too large',
      });
    }

    const key = `${randomStringGenerator()}.${file.fileName.split('.').pop()?.toLowerCase()}`;

    const command = new PutObjectCommand({
      Bucket: this.configService.getOrThrow('file.awsDefaultS3Bucket', { infer: true }),
      Key: key,
      ContentLength: file.fileSize,
    });
    const signedUrl = await getSignedUrl(this.s3, command, { expiresIn: 3600 });
    const data = await this.fileRepository.create({
      path: key,
    });

    return {
      file: data,
      uploadSignedUrl: signedUrl,
    };
  }
}
