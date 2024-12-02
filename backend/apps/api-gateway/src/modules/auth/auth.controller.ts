import { ApiWrapperResponse } from '@gateway/decorators/api-wrapper-response.decorator';
import { AuthUser } from '@gateway/decorators/auth-user.decorator';
import { Auth } from '@gateway/decorators/http.decorator';
import { Controller, Get } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

import { AuthenticatedUserDto } from './auth-user.dto';
import { AuthenticatedUser } from './auth-user.interface';

@Controller('auth')
export class AuthController {
  constructor() {}

  @Auth()
  @Get('user-info')
  @ApiOperation({ summary: 'Get user information' })
  @ApiWrapperResponse({ type: AuthenticatedUserDto })
  getProfile(@AuthUser() user: AuthenticatedUser) {
    return user;
  }
}
