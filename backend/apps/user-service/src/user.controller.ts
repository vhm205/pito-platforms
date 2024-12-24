import {
  GetCustomerProfileRequest,
  GetCustomerProfileResponse,
  GetUserPartnerProfileRequest,
  GetUserPartnerProfileResponse,
  UsersServiceController,
  UsersServiceControllerMethods,
} from '@app/common';
import { Controller } from '@nestjs/common';

import { UserService } from './user.service';

@Controller()
@UsersServiceControllerMethods()
export class UserController implements UsersServiceController {
  constructor(private readonly userService: UserService) {}

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
}
