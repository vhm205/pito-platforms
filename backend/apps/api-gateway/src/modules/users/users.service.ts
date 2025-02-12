import { USER_SERVICE, USERS_SERVICE_NAME, UsersServiceClient } from '@app/common';
import { FilterRuleDto } from '@gateway/gateway-common/dto/query-dto';
import { Inject, Injectable } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

import { QueryCustomerListDto } from './dto/customer-list.dto';

@Injectable()
export class UsersService {
  private usersService: UsersServiceClient;

  constructor(@Inject(USER_SERVICE) private client: ClientGrpc) {}

  onModuleInit() {
    this.usersService = this.client.getService<UsersServiceClient>(USERS_SERVICE_NAME);
  }

  async getCompanies(query: { filters: FilterRuleDto[]; page: number; pageSize: number }) {
    const { data, error, totalCount } = await firstValueFrom(
      this.usersService.getCompanies({
        filters: query.filters,
        pagination: { currentPage: query.page, pageSize: query.pageSize },
        sorts: [],
      }),
    );
    if (error) throw new Error(error);
    return { companies: data ?? [], totalCount };
  }

  async getListCustomers(query: QueryCustomerListDto) {
    const { data, error, totalCount } = await firstValueFrom(
      this.usersService.getCustomers({
        filters: query.filters,
        pagination: { currentPage: query.page, pageSize: query.pageSize },
        sorts: query.sorts,
      }),
    );
    if (error) throw new Error(error);
    return { customers: data ?? [], totalCount };
  }
}
