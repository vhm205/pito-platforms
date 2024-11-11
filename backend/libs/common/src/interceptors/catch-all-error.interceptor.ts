import { LoggerService } from '@app/common';
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
} from '@nestjs/common';
import { RpcException, RmqContext } from '@nestjs/microservices';
import * as Sentry from '@sentry/nestjs';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class CatchAllErrorInterceptor implements NestInterceptor {
  constructor(private readonly logger: LoggerService) {}

  ackValidationFailed(args: any[]) {
    // Ack to message queue if error is validation failed.
    args.map(arg => {
      if (arg instanceof RmqContext) {
        const channel = arg.getChannelRef();
        const originalMessage = arg.getMessage();
        channel.ack(originalMessage);
      }
    });
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const isHttp = context.getType() === 'http';
    const isRpc = context.getType() === 'rpc';

    const timestamp = new Date().toISOString();

    return next.handle().pipe(
      catchError(error => {
        if (isHttp) {
          const request = context.switchToHttp().getRequest();
          const method = request.method;
          const url = request.url;

          this.logger.error(`HTTP Error in ${method} ${url}: ${error.message}`, error.stack);

          Sentry.captureException(error, {
            level: 'error',
          });

          const statusCode = error instanceof HttpException ? error.getStatus() : 500;
          const message = error.message || 'An unexpected error occurred';

          return throwError(
            () =>
              new HttpException(
                {
                  statusCode,
                  message,
                  timestamp,
                  path: url,
                  method,
                },
                statusCode,
              ),
          );
        } else if (isRpc) {
          const rpcMethod = context.getHandler().name;
          const args = context.getArgs();
          const isValidationError = !!error?.error?.validationErrors;

          if (isValidationError) {
            this.ackValidationFailed(args);
          }

          this.logger.error(`gRPC Error in ${rpcMethod}: ${error.message}`, error.stack);

          Sentry.captureException(error, {
            level: 'error',
          });

          return throwError(
            () =>
              new RpcException({
                statusCode: error.code || 13, // gRPC default internal error code
                message: error.message || 'An unexpected gRPC error occurred',
                timestamp,
                method: rpcMethod,
              }),
          );
        }

        this.logger.error(
          `Unhandled Error in ${context.getType()} context: ${error.message}`,
          error.stack,
        );

        return throwError(() => error);
      }),
    );
  }
}
