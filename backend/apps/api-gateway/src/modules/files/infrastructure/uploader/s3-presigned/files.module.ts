import { S3Client } from '@aws-sdk/client-s3';
import { AllConfigType } from '@app/common/configs';
import { HttpStatus, Module, UnprocessableEntityException } from '@nestjs/common';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import * as multerS3 from 'multer-s3';
import { FilesS3PresignedController } from './files.controller';
import { FilesS3PresignedService } from './files.service';
import { RelationalFilesPersistenceModule } from '../../persistence/relational/relational-persistence.module';

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
          fileFilter: (_req, file, cb) => {
            if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
              return cb(
                new UnprocessableEntityException({
                  status: HttpStatus.UNPROCESSABLE_ENTITY,
                  errors: {
                    file: `cantUploadFileType`,
                  },
                }),
                false,
              );
            }
            cb(null, true);
          },
          storage: multerS3({
            s3: s3,
            bucket: configService.getOrThrow('file.awsDefaultS3Bucket', { infer: true }),
            acl: 'public-read',
            contentType: multerS3.AUTO_CONTENT_TYPE,
            key: (_req, file, cb) => {
              cb(
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
  controllers: [FilesS3PresignedController],
  providers: [FilesS3PresignedService],
  exports: [FilesS3PresignedService],
})
export class FilesS3PresignedModule {}
