import { ArgumentsHost, Catch, RpcExceptionFilter } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Observable, throwError } from 'rxjs';

import { GrpcStatus } from '../enums';
import { LoggerService } from '../logger';

@Catch(RpcException)
export class GlobalRpcExceptionFilter implements RpcExceptionFilter<RpcException> {
  constructor(private readonly logger: LoggerService) {}

  catch(exception: RpcException, host: ArgumentsHost): Observable<RpcError> {
    const ctx = host.switchToRpc();
    const data = ctx.getData();
    const errorResponse = exception.getError() as RpcError;

    this.logger.error(errorResponse.message, {
      trace: exception.stack,
      metadata: data,
    });

    return throwError(() => errorResponse);
  }
}

export class RpcError {
  constructor(
    public message: string,
    public code: GrpcStatus,
    public metadata?: Record<string, unknown>,
  ) {}
}
