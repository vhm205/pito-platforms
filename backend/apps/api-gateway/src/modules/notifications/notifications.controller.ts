import { RoleType } from '@gateway/constants';
import { AuthUser } from '@gateway/decorators';
import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';

import { Auth } from '../../decorators/http.decorator';
import { AuthenticatedUser } from '../auth/auth-user.interface';

import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get('total')
  @Auth([RoleType.CUSTOMER])
  @HttpCode(HttpStatus.OK)
  getTotalNotifications(@AuthUser() user: AuthenticatedUser) {
    return this.notificationsService.getTotalNotifications(user.id);
  }
}
