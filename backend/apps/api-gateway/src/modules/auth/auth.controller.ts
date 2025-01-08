import { RoleType } from '@gateway/constants';
import { ApiWrapperResponse } from '@gateway/decorators/api-wrapper-response.decorator';
import { AuthUser } from '@gateway/decorators/auth-user.decorator';
import { Auth } from '@gateway/decorators/http.decorator';
import { Controller, Get } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

import { AuthenticatedUserDto } from './auth-user.dto';
import { AuthenticatedUser } from './auth-user.interface';
import { AuthService } from './auth.service';
import { GetCustomerProfileResponseDto } from './dtos/get-customer-profile.dto';
import { GetUserPartnerResponseDto } from './dtos/get-user-partner.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Auth()
  @Get('user-info')
  @ApiOperation({ summary: 'Get user information' })
  @ApiWrapperResponse({ type: AuthenticatedUserDto })
  getProfile(@AuthUser() user: AuthenticatedUser) {
    return user;
  }

  @Auth([RoleType.CUSTOMER])
  @Get('customer-info')
  @ApiOperation({ summary: 'Get customer profile' })
  @ApiWrapperResponse({ type: GetCustomerProfileResponseDto })
  getCustomerProfile(@AuthUser() user: AuthenticatedUser) {
    return this.authService.getCustomerProfileByUserId(user.id);
  }

  @Auth([RoleType.PARTNER])
  @Get('partner-info')
  @ApiOperation({ summary: 'Get partner profile' })
  @ApiWrapperResponse({ type: GetUserPartnerResponseDto })
  getPartnerProfile(@AuthUser() user: AuthenticatedUser) {
    return this.authService.getPartnerProfileByUserId(user.id);
  }

  @Auth([RoleType.OPERATOR])
  @Get('operator-info')
  @ApiOperation({ summary: 'Get operator profile' })
  @ApiWrapperResponse({ type: GetUserPartnerResponseDto })
  getOperatorProfile(@AuthUser() user: AuthenticatedUser) {
    return this.authService.getOperatorProfileByUserId(user.id);
  }
}
