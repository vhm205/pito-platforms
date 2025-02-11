import { LoggerService } from '@app/common';
import * as REGIONS_OF_VIETNAM from '@gateway/assets/regions_of_vietnam.json';
import { ApiWrapperResponse } from '@gateway/decorators/api-wrapper-response.decorator';
import { WebhookAuth } from '@gateway/decorators/webhook-auth.decorator';
import { WebhookGuard } from '@gateway/guards/webhook.guard';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

import { SearchAdapter } from './adapter/adapter.interface';
import {
  AutocompleteFeedQueryDto,
  IndexAutocompleteFeedRequestBodyDto,
  AutocompleteFeedResponseDto,
  RegionDto,
  DistrictDto,
  WardDto,
} from './dto/autocomplete-feed.dto';

@Controller('search')
export class SearchController {
  constructor(
    private readonly searchAdapter: SearchAdapter,
    private readonly logger: LoggerService,
  ) {}

  @Get('/autocompleteFeed')
  @HttpCode(HttpStatus.OK)
  @ApiWrapperResponse({ type: [AutocompleteFeedResponseDto] })
  async autocompleteFeed(@Query() { query, limit }: AutocompleteFeedQueryDto) {
    const result = await this.searchAdapter.searchAutocompleteFeed(query, limit);
    return plainToInstance(AutocompleteFeedResponseDto, result);
  }

  @Post('/autocompleteFeed')
  @UseGuards(WebhookGuard)
  @WebhookAuth('webhook.postgresqlTrigger')
  @HttpCode(HttpStatus.OK)
  async indexAutocompleteFeed(@Body() { documents, action }: IndexAutocompleteFeedRequestBodyDto) {
    try {
      await this.searchAdapter.syncAutocompleteFeed(documents, action);
      this.logger.log('Autocomplete feed indexed', {
        context: SearchController.name,
      });
      return 'Autocomplete feed indexed';
    } catch (e) {
      const error = e as Error;
      this.logger.error('Failed to index autocomplete feed => ' + error.message, {
        context: SearchController.name,
        trace: error.stack,
      });
      return 'Failed to index autocomplete feed => ' + error.message;
    }
  }

  @Get('/regions')
  @HttpCode(HttpStatus.OK)
  @ApiWrapperResponse({ type: [RegionDto] })
  async findRegions() {
    const data = REGIONS_OF_VIETNAM;
    const regions = data?.regions;
    return regions;
  }

  @Get('/districts')
  @HttpCode(HttpStatus.OK)
  @ApiWrapperResponse({ type: [DistrictDto] })
  async findDistricts(@Query('regionId') regionId: string) {
    const data = REGIONS_OF_VIETNAM;
    const districts = data?.districts[regionId] ?? [];
    return districts;
  }

  @Get('/wards')
  @HttpCode(HttpStatus.OK)
  @ApiWrapperResponse({ type: [WardDto] })
  async findWards(@Query('districtId') districtId: string) {
    const data = REGIONS_OF_VIETNAM;
    const wards = data?.wards[districtId] ?? [];
    return wards;
  }
}
