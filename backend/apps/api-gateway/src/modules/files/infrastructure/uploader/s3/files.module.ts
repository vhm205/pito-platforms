import { AllConfigType } from '@app/common/configs';
import { S3Client } from '@aws-sdk/client-s3';
import { HttpStatus, Module, UnprocessableEntityException } from '@nestjs/common';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import * as multerS3 from 'multer-s3';

// eslint-disable-next-line max-len
import { RelationalFilesPersistenceModule } from '../../persistence/relational/relational-persistence.module';

import { FilesS3Controller } from './files.controller';
import { FilesS3Service } from './files.service';
// eslint-disable-next-line max-len

@Module({
  imports: [
    RelationalFilesPersistenceModule,
    MulterModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<AllConfigType>) => {
        const s3 = new S3Client({
          region: configService.get('file.awsS3Region', { infer: true }),
          credentials: {
            accessKeyId: configService.getOrThrow('file.accessKeyId', {
              infer: true,
            }),
            secretAccessKey: configService.getOrThrow('file.secretAccessKey', {
              infer: true,
            }),
          },
        });

        return {
          fileFilter: (_req, file, resolve) => {
            if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
              return resolve(
                new UnprocessableEntityException({
                  status: HttpStatus.UNPROCESSABLE_ENTITY,
                  errors: {
                    file: `cantUploadFileType`,
                  },
                }),
                false,
              );
            }
            resolve(null, true);
          },
          storage: multerS3({
            s3,
            bucket: configService.getOrThrow('file.awsDefaultS3Bucket', {
              infer: true,
            }),
            contentType: multerS3.AUTO_CONTENT_TYPE,
            key: (_req, file, resolve) => {
              resolve(
                null,
                `${randomStringGenerator()}.${file.originalname.split('.').pop()?.toLowerCase()}`,
              );
            },
          }),
          limits: {
            fileSize: configService.get('file.maxFileSize', { infer: true }),
          },
        };
      },
    }),
  ],
  controllers: [FilesS3Controller],
  providers: [FilesS3Service],
  exports: [FilesS3Service],
})
export class FilesS3Module {}
