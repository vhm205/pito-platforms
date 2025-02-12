import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/*
 * This interceptor is used to convert Long to Number
 * @Example
 * Input: {
 *   "amount": {
 *     "__isLong__": true,
 *     "low": 1000,
 *     "high": 0,
 *     "unsigned": false
 *   }
 * }
 * Output: {
 *   "amount": 1000
 * }
 */
@Injectable()
export class LongToNumberInterceptor implements NestInterceptor {
  intercept(_context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(map(data => this.transformLongToNumber(data)));
  }

  private isLong(obj) {
    return (obj && obj['__isLong__']) === true;
  }

  private transformLongToNumber(obj: any): any {
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }

    if (this.isLong(obj)) {
      return obj.toNumber();
    }

    if (Array.isArray(obj)) {
      return obj.map(item => this.transformLongToNumber(item));
    }

    const transformedObj = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        transformedObj[key] = this.transformLongToNumber(obj[key]);
      }
    }

    return transformedObj;
  }
}
