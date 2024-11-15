/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from '@nestjs/microservices';
import { Observable } from 'rxjs';

export const protobufPackage = 'menu';

export interface Empty {}

export const MENU_PACKAGE_NAME = 'menu';

export interface MenusServiceClient {
  findMenus(request: Empty): Observable<Empty>;
}

export interface MenusServiceController {
  findMenus(request: Empty): Promise<Empty> | Observable<Empty> | Empty;
}

export function MenusServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ['findMenus'];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod('MenusService', method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod('MenusService', method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const MENUS_SERVICE_NAME = 'MenusService';
