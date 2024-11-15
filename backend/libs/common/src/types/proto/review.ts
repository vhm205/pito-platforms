/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from '@nestjs/microservices';
import { Observable } from 'rxjs';

export const protobufPackage = 'review';

export interface Empty {}

export const REVIEW_PACKAGE_NAME = 'review';

export interface ReviewsServiceClient {
  findReviews(request: Empty): Observable<Empty>;
}

export interface ReviewsServiceController {
  findReviews(request: Empty): Promise<Empty> | Observable<Empty> | Empty;
}

export function ReviewsServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ['findReviews'];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod('ReviewsService', method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod('ReviewsService', method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const REVIEWS_SERVICE_NAME = 'ReviewsService';
