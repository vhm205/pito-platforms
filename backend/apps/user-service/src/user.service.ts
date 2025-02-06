import {
  GetCompaniesRequest,
  GetCustomerProfileRequest,
  GetCustomersRequest,
  GetUserPartnerProfileRequest,
  transformFilterRule,
} from '@app/common';
import { GrpcStatus } from '@app/common/enums';
import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

import { CustomerRepository } from './infrastructure/persistence/customer.repository';
import { UserPartnerRepository } from './infrastructure/persistence/user-partner.repository';

@Injectable()
export class UserService {
  constructor(
    private readonly customerRepository: CustomerRepository,
    private readonly userPartnerRepository: UserPartnerRepository,
  ) {}

  async getCustomerProfile({ userId }: GetCustomerProfileRequest) {
    const customer = await this.customerRepository.findOne({ id: userId });

    if (!customer) {
      throw new RpcException({
        message: `Customer account not found by user id ${userId}.`,
        status: GrpcStatus.NOT_FOUND,
      });
    }

    return customer;
  }

  async getUserPartnerProfile({ userId }: GetUserPartnerProfileRequest) {
    const user = await this.userPartnerRepository.findOne({ id: userId });

    if (!user) {
      throw new RpcException({
        message: `User not found by id ${userId}.`,
        status: GrpcStatus.NOT_FOUND,
      });
    }

    const roles = await this.userPartnerRepository.findRolesByUserId(userId);

    return {
      ...user.toMessage(),
      roles,
    };
  }

  async getCustomers({ pagination, sorts, filters }: GetCustomersRequest) {
    const [customers, totalCount] = await this.customerRepository.findAndCount({
      pagination: pagination!,
      filters: filters.map(transformFilterRule),
      sorts,
    });

    return { data: customers.map(c => c.toMessage()), totalCount };
  }

  async getCompanies({ pagination, sorts, filters }: GetCompaniesRequest) {
    const [companies, totalCount] = await this.customerRepository.findAndCountCompanies({
      pagination: pagination!,
      filters: filters.map(transformFilterRule),
      sorts,
    });

    return { data: companies, totalCount };
  }
}
