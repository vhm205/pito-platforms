import { AuthUser } from '@gateway/decorators/auth-user.decorator';
import { Auth } from '@gateway/decorators/http.decorator';
import { Controller, Get } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor() {}

  @Auth()
  @Get('user-info')
  getProfile(@AuthUser() user: any) {
    return { data: user };
  }
}
