import { Module } from '@nestjs/common';
import { AhamoveOrderTransformer } from './ahamove.transformer';

@Module({
  providers: [AhamoveOrderTransformer],
  exports: [AhamoveOrderTransformer],
})
export class TransformerModule {}
