import {
  GetCompaniesRequest,
  GetCompaniesResponse,
  GetCustomerProfileRequest,
  GetCustomerProfileResponse,
  GetCustomersRequest,
  GetCustomersResponse,
  GetUserPartnerProfileRequest,
  GetUserPartnerProfileResponse,
  LoggerService,
  UsersServiceController,
  UsersServiceControllerMethods,
} from '@app/common';
import { Controller } from '@nestjs/common';

import { UserService } from './user.service';

@Controller()
@UsersServiceControllerMethods()
export class UserController implements UsersServiceController {
  constructor(
    private readonly logger: LoggerService,
    private readonly userService: UserService,
  ) {}

  async getCustomerProfile(
    request: GetCustomerProfileRequest,
  ): Promise<GetCustomerProfileResponse> {
    const result = await this.userService.getCustomerProfile(request);
    return result.toMessage();
  }

  async getPartnerProfile(
    request: GetUserPartnerProfileRequest,
  ): Promise<GetUserPartnerProfileResponse> {
    return this.userService.getUserPartnerProfile(request);
  }

  async getOperatorProfile(
    request: GetUserPartnerProfileRequest,
  ): Promise<GetUserPartnerProfileResponse> {
    return this.userService.getUserPartnerProfile(request);
  }

  async getCustomers(request: GetCustomersRequest): Promise<GetCustomersResponse> {
    try {
      request.filters ??= [];
      request.sorts ??= [];

      return await this.userService.getCustomers(request);
    } catch (e) {
      const errMessage = (e as Error).message;
      this.logger.error(errMessage);
      return { error: errMessage, data: [], totalCount: 0 };
    }
  }

  async getCompanies(request: GetCompaniesRequest): Promise<GetCompaniesResponse> {
    try {
      request.filters ??= [];
      request.sorts ??= [];

      return await this.userService.getCompanies(request);
    } catch (e) {
      const errMessage = (e as Error).message;
      this.logger.error(errMessage);
      return { error: errMessage, data: [], totalCount: 0 };
    }
  }
}
