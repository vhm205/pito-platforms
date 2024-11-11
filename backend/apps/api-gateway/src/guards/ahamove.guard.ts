import { AllConfigType } from '@app/common/configs';
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class AhamoveWebhookGuard implements CanActivate {
  constructor(private readonly configService: ConfigService<AllConfigType>) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();

    const apiKey = request.headers['apikey']?.toString();
    const authorization = request.headers['authorization']?.replace('Bearer ', '');
    const token = apiKey ?? authorization ?? '';

    if (!this.isAhamoveToken(token)) {
      throw new UnauthorizedException('The request is not authenticated');
    }

    return true;
  }

  private isAhamoveToken(token: string) {
    return token === this.configService.get('external.ahamove.orderEventsApiKey', { infer: true });
  }
}
