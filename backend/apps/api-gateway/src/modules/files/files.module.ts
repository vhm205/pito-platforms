import { Module } from '@nestjs/common';
import { FileConfig, FileDriver, fileConfig } from '@app/common/configs';
import { RelationalFilesPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { FilesS3Module } from './infrastructure/uploader/s3/files.module';
import { FilesS3PresignedModule } from './infrastructure/uploader/s3-presigned/files.module';
import { FilesService } from './files.service';

const InfrastructurePersistenceModule = RelationalFilesPersistenceModule;

const InfrastructureUploaderModule =
  (fileConfig() as FileConfig).driver === FileDriver.S3 ? FilesS3Module : FilesS3PresignedModule;

@Module({
  imports: [InfrastructurePersistenceModule, InfrastructureUploaderModule],
  providers: [FilesService],
  exports: [FilesService, InfrastructurePersistenceModule],
})
export class FilesModule {}
