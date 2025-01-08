import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class CamelCaseResponseInterceptor implements NestInterceptor {
  private toCamelCase(str: string): string {
    return str.replace(/([-_][a-z])/gi, $1 => {
      return $1.toUpperCase().replace('-', '').replace('_', '');
    });
  }

  private convertKeysToCamelCase<T>(obj: any): T {
    if (obj === null || typeof obj !== 'object' || obj instanceof Date) {
      return obj;
    }

    if (Array.isArray(obj)) {
      return obj.map(item => this.convertKeysToCamelCase(item)) as any;
    }

    const camelCaseObj: any = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const camelCaseKey = this.toCamelCase(key);
        camelCaseObj[camelCaseKey] = this.convertKeysToCamelCase(obj[key]);
      }
    }

    return camelCaseObj;
  }

  intercept(_context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map(data => {
        return this.convertKeysToCamelCase(data);
      }),
    );
  }
}
