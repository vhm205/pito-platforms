import { LoggerService } from '@app/common';
import { KeycloakWebhookGuard } from '@gateway/guards/keycloak.guard';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';

import { AuthService } from '../../auth/auth.service';
import { SupabaseUserCallback } from '../types';

@Controller('webhook/supabase')
@UseGuards(KeycloakWebhookGuard)
export class SupabaseWebhookController {
  constructor(
    private readonly logger: LoggerService,
    private readonly authService: AuthService,
  ) {}

  @Post('customer-users')
  async handleCustomerUser(@Body() payload: SupabaseUserCallback) {
    this.logger.debug('Received Supabase customer user events', payload);

    if (payload.type === 'INSERT') {
      const userPayload = payload.record;

      const user = await this.authService.initUser(
        userPayload.id,
        'customer',
        userPayload.email,
        userPayload.raw_user_meta_data.first_name || userPayload.raw_user_meta_data.name,
        userPayload.raw_user_meta_data.last_name,
      );

      return { type: 'insert', user };
    }

    return {
      type: 'skip',
    };
  }

  @Post('partner-users')
  async handlePartnerUser(@Body() payload: SupabaseUserCallback) {
    this.logger.debug('Received Supabase partner user events', payload);

    if (payload.type === 'INSERT') {
      const userPayload = payload.record;

      const user = await this.authService.initUser(
        userPayload.id,
        'partner',
        userPayload.email,
        userPayload.raw_user_meta_data.first_name || userPayload.raw_user_meta_data.name,
        userPayload.raw_user_meta_data.last_name,
      );

      return { type: 'insert', user };
    }

    return {
      type: 'skip',
    };
  }
}
