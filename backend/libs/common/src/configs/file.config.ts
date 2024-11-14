import { registerAs } from '@nestjs/config';
import { IsEnum, IsString, ValidateIf } from 'class-validator';

import { validateConfig } from './validate-config';

export enum FileDriver {
  LOCAL = 'local',
  S3 = 's3',
  S3_PRESIGNED = 's3-presigned',
}

export type FileConfig = {
  driver: FileDriver;
  accessKeyId?: string;
  secretAccessKey?: string;
  awsDefaultS3Bucket?: string;
  awsS3Region?: string;
  maxFileSize: number;
};

class ConfigVariablesValidator {
  @IsEnum(FileDriver)
  FILE_DRIVER: FileDriver;

  @ValidateIf(envValues => [FileDriver.S3, FileDriver.S3_PRESIGNED].includes(envValues.FILE_DRIVER))
  @IsString()
  AWS_ACCESS_KEY_ID: string;

  @ValidateIf(envValues => [FileDriver.S3, FileDriver.S3_PRESIGNED].includes(envValues.FILE_DRIVER))
  @IsString()
  AWS_SECRET_ACCESS_KEY: string;

  @ValidateIf(envValues => [FileDriver.S3, FileDriver.S3_PRESIGNED].includes(envValues.FILE_DRIVER))
  @IsString()
  AWS_DEFAULT_S3_BUCKET: string;

  @ValidateIf(envValues => [FileDriver.S3, FileDriver.S3_PRESIGNED].includes(envValues.FILE_DRIVER))
  @IsString()
  AWS_S3_REGION: string;
}

// eslint-disable-next-line import/no-default-export
export default registerAs<FileConfig>('file', () => {
  validateConfig(process.env, ConfigVariablesValidator);

  return {
    driver: (process.env.FILE_DRIVER as FileDriver) ?? FileDriver.LOCAL,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    awsDefaultS3Bucket: process.env.AWS_DEFAULT_S3_BUCKET,
    awsS3Region: process.env.AWS_S3_REGION,
    maxFileSize: 5242880, // 5mb
  };
});
