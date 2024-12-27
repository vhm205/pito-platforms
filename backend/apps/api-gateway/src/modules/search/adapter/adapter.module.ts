import { Module } from '@nestjs/common';

import { SearchAdapter } from './adapter.interface';
import { TypesenseAdapter } from './typesense.adapter';

@Module({
  providers: [
    {
      provide: SearchAdapter,
      useClass: TypesenseAdapter,
    },
  ],
  exports: [SearchAdapter],
})
export class SearchAdapterModule {}
