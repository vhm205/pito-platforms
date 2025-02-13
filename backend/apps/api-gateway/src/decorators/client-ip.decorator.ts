import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const ClientIP = createParamDecorator((_data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();

  // Handle different request types (Express, Fastify)
  const forwardedFor = request.headers['x-forwarded-for'];

  if (forwardedFor) {
    return Array.isArray(forwardedFor)
      ? forwardedFor[0].split(',')[0].trim()
      : forwardedFor.split(',')[0].trim();
  }

  return (
    request.socket?.remoteAddress || request.connection?.remoteAddress || request.ip || '127.0.0.1'
  );
});
