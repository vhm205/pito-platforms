import { AuthenticatedPartner } from '@gateway/modules/auth/auth-user.interface';
import { AuthService } from '@gateway/modules/auth/auth.service';
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class PartnerInterceptor implements NestInterceptor {
  constructor(private readonly authService: AuthService) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();

    const { partner_id: partnerId } = request.query;

    if (!partnerId) {
      return next.handle();
    }

    const partnerResponse = await this.authService.getPartnerById(partnerId);

    if (!partnerResponse || !partnerResponse.data) {
      throw new BadRequestException(`Partner not found for ID: ${partnerId}`);
    }

    request.partner = {
      id: partnerResponse.data.id,
      name: partnerResponse.data.name,
      status: partnerResponse.data.status,
    } as AuthenticatedPartner;

    return next.handle();
  }
}
