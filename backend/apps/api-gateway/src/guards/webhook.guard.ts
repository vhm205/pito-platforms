import { AllConfigType } from '@app/common/configs';
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

@Injectable()
export class WebhookGuard implements CanActivate {
  constructor(
    private readonly configService: ConfigService<AllConfigType>,
    private readonly reflector: Reflector,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const whSecret = this.reflector.get<string>('whSecret', context.getHandler());
    const validToken = this.configService.get<string>(whSecret, { infer: true });

    const token =
      request.headers['apikey']?.toString() ??
      request.headers['authorization']?.replace('Bearer ', '');

    if (!token || token !== validToken)
      throw new UnauthorizedException('The request is not authenticated');

    return true;
  }
}
