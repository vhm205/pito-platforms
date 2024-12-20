/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from '@nestjs/microservices';
import { Observable } from 'rxjs';

export const protobufPackage = 'notification';

export interface GetTotalNotificationRequest {
  userId: string;
}

export interface GetTotalNotificationResponse {
  totalNotification: number;
  totalUnreadNotification: number;
}

export const NOTIFICATION_PACKAGE_NAME = 'notification';

export interface NotificationServiceClient {
  getTotalNotification(
    request: GetTotalNotificationRequest,
  ): Observable<GetTotalNotificationResponse>;
}

export interface NotificationServiceController {
  getTotalNotification(
    request: GetTotalNotificationRequest,
  ):
    | Promise<GetTotalNotificationResponse>
    | Observable<GetTotalNotificationResponse>
    | GetTotalNotificationResponse;
}

export function NotificationServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ['getTotalNotification'];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod('NotificationService', method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod('NotificationService', method)(
        constructor.prototype[method],
        method,
        descriptor,
      );
    }
  };
}

export const NOTIFICATION_SERVICE_NAME = 'NotificationService';
