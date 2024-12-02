import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class KeycloakWebhookGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();

    const apiKey = request.headers['x-api-key']?.toString();

    if (apiKey !== this.configService.get<string>('KEYCLOAK_API_KEY', { infer: true })) {
      throw new UnauthorizedException('The request is not authenticated');
    }

    return true;
  }
}
