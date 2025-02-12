import { DEFAULT_PAGE_NUMBER } from '@app/common';
import { RoleType } from '@gateway/constants';
import { ApiPageWrapperResponse, Auth } from '@gateway/decorators';
import { PageMetaDto } from '@gateway/gateway-common/dto/page-meta.dto';
import { PageDto } from '@gateway/gateway-common/dto/page.dto';
import { emptyPaginationResponse } from '@gateway/utils/common';
import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { assign, isEmpty, reduce } from 'lodash';

import { CustomerListDto, QueryCustomerListDto } from './dto/customer-list.dto';
import { UsersService } from './users.service';

@Controller('operator')
export class OperatorCustomerController {
  constructor(private readonly userService: UsersService) {}

  @Get('customers')
  @Auth([RoleType.OPERATOR])
  @HttpCode(HttpStatus.OK)
  @ApiPageWrapperResponse({ type: CustomerListDto })
  async getCustomers(@Query() query: QueryCustomerListDto) {
    const hasCompanyFilter = query.filters.find(f => f.column === 'company');

    if (hasCompanyFilter) {
      query.filters = query.filters.filter(f => f.column !== 'company');
      const { companies } = await this.userService.getCompanies({
        filters: [
          {
            column: 'name',
            operator: 'ilike',
            value: hasCompanyFilter.value,
          },
        ],
        page: query.page,
        pageSize: query.pageSize,
      });
      if (isEmpty(companies)) {
        return emptyPaginationResponse({
          page: query.page,
          pageSize: query.pageSize,
          totalCount: 0,
        });
      }

      query.filters.push({
        column: 'companyId',
        operator: 'in',
        value: companies.map(c => c.id).join(','),
      });

      const { customers, totalCount } = await this.userService.getListCustomers(query);
      const companiesMap = reduce(companies, (acc, c) => assign(acc, { [c.id]: c }), {});
      customers.forEach(c => c.companyId && assign(c, { company: companiesMap[c.companyId].name }));

      const transformedCustomers = plainToInstance(CustomerListDto, customers, {
        excludeExtraneousValues: true,
      });

      const pageMeta = new PageMetaDto({
        pageOptions: { page: query.page, pageSize: query.pageSize },
        totalCount,
      });

      return new PageDto<CustomerListDto>(transformedCustomers, pageMeta);
    }

    const { customers, totalCount } = await this.userService.getListCustomers(query);

    const companyIds = Array.from(new Set(customers.map(c => c.companyId).filter(Boolean)));
    if (companyIds.length) {
      const { companies } = await this.userService.getCompanies({
        filters: [
          {
            column: 'id',
            operator: 'in',
            value: companyIds.join(','),
          },
        ],
        page: DEFAULT_PAGE_NUMBER,
        pageSize: companyIds.length,
      });

      const companiesMap = reduce(companies, (acc, c) => assign(acc, { [c.id]: c }), {});
      customers.forEach(c => c.companyId && assign(c, { company: companiesMap[c.companyId].name }));
    }

    const transformedCustomers = plainToInstance(CustomerListDto, customers, {
      excludeExtraneousValues: true,
    });

    const pageMeta = new PageMetaDto({
      pageOptions: { page: query.page, pageSize: query.pageSize },
      totalCount,
    });

    return new PageDto<CustomerListDto>(transformedCustomers, pageMeta);
  }
}
