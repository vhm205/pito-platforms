import { Module } from '@nestjs/common';

import { SearchAdapterModule } from './adapter/adapter.module';
import { SearchController } from './search.controller';

@Module({
  imports: [SearchAdapterModule],
  controllers: [SearchController],
  providers: [],
  exports: [],
})
export class SearchModule {}
