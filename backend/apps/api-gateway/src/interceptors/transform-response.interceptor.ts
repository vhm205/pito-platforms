import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable, from } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Injectable()
export class TransformResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      switchMap(data => from(Promise.resolve(data))),
      map(resolvedData => {
        // resolvedData instanceof PageDto
        if (resolvedData && resolvedData.data && resolvedData.meta) {
          return {
            statusCode: context.switchToHttp().getResponse().statusCode,
            message: 'Success',
            data: resolvedData.data,
            meta: resolvedData.meta,
          };
        }

        return {
          statusCode: context.switchToHttp().getResponse().statusCode,
          message: 'Success',
          data: resolvedData,
        };
      }),
    );
  }
}
