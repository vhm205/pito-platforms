import { LoggerService } from '@app/common';
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import * as Sentry from '@sentry/nestjs';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class CatchAllErrorInterceptor implements NestInterceptor {
  constructor(private readonly logger: LoggerService) {}

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
          const message = error.message || 'An unexpected error occurred';
          const statusCode = error instanceof HttpException ? error.getStatus() : 500;

          if (error.response?.errors) {
            const errors = error.response.errors;
            this.logger.error(
              `HTTP Error in ${method} ${url}: ${JSON.stringify(errors)}`,
              error.stack,
            );
          } else {
            this.logger.error(`HTTP Error in ${method} ${url}: ${error.message}`, error.stack);
          }

          Sentry.captureException(error, {
            level: 'error',
          });

          return throwError(
            () =>
              new HttpException(
                {
                  statusCode,
                  message,
                  timestamp,
                  path: url,
                  method,
                  errors: error.response?.errors,
                },
                statusCode,
              ),
          );
        } else if (isRpc) {
          const rpcMethod = context.getHandler().name;

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
