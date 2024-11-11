/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from '@nestjs/microservices';
import { wrappers } from 'protobufjs';
import { Observable } from 'rxjs';

export const protobufPackage = 'order';

/** Enum for sorting direction */
export enum SortDirection {
  ASC = 0,
  DESC = 1,
  UNRECOGNIZED = -1,
}

export interface OrderResponse {
  order?: Order | undefined;
}

export interface OrderUpdateStatusDto {
  orderId: string;
  status: string;
  reason?: string | undefined;
}

export interface OrderUpdateResponse {
  message: string;
  statusCode: number;
  success: boolean;
}

export interface OrderFilterDto {
  userId: string;
  keyword: string;
  status: string;
  fromDate: string;
  toDate: string;
  deliveryDate: string;
  sortBy: string;
  sortDirection: string;
  pageSize: string;
  from: string;
}

export interface FindOneOrderDto {
  id: string;
}

/** Message for Order Items */
export interface OrderItem {
  itemId: string;
  itemName: string;
  itemSlug: string;
  price: number;
  quantity: number;
  totalPrice: number;
  notes: string;
  rawOptionsChoices: string[];
  item: OrderItem_Item | undefined;
}

export interface OrderItem_Item {
  id: string;
  name: string;
  slug: string;
  index: number;
  images: string[];
  storeId: string;
  isActive: boolean;
  unitType: string;
  basePrice: number;
  createdAt: string;
  deletedAt: string;
  ftsVector: string;
  updatedAt: string;
  description: string;
  setupParty: boolean;
  maxQuantity: number;
  minQuantity: number;
  specialNote: string;
  cuisineTypes: number[];
  serviceTypes: number[];
  unitQuantity: number;
  eatingUtensil: string;
  packagingType: string;
  occasionEvents: string[];
  menuCategoryId: string;
  preparationTime: number;
  serverAvailable: boolean;
  extraDescription: string;
  specialDietaries: number[];
  optionsAndChoices: string;
}

/** Message for Order */
export interface Order {
  orderId: string;
  storeName: string;
  introduction: string;
  slug: string;
  thumbnail: string;
  avatar: string;
  orderCode: string;
  totalPrice: number;
  note: string;
  receiverName: string;
  status: string;
  errorCode: number;
  paymentMethod: string;
  createdAt: Date | undefined;
  deliveryDate: Date | undefined;
  orderItems: OrderItem[];
}

export interface Orders {
  orders: Order[];
  total: number;
}

/** GetOrderRequest with pagination */
export interface QueryOrderWithPagination {
  /** Page number for pagination */
  page: number;
  /** Number of items per page */
  pageSize: number;
  /** List of filters for querying orders */
  filters: QueryOrderWithPagination_OrderFilter | undefined;
  /** List of sorting criteria */
  sorts: QueryOrderWithPagination_OrderSort[];
}

/** Filtering criteria */
export interface QueryOrderWithPagination_OrderFilter {
  status?: string | undefined;
  keyword?: string | undefined;
  fromDate?: string | undefined;
  toDate?: string | undefined;
}

/** Sorting criteria */
export interface QueryOrderWithPagination_OrderSort {
  field: string;
  direction: SortDirection;
}

export interface OrderWithPagination {
  orders: Order[];
  total: number;
}

export const ORDER_PACKAGE_NAME = 'order';

wrappers['.google.protobuf.Timestamp'] = {
  fromObject(value: Date) {
    return { seconds: value.getTime() / 1000, nanos: (value.getTime() % 1000) * 1e6 };
  },
  toObject(message: { seconds: number; nanos: number }) {
    return new Date(message.seconds * 1000 + message.nanos / 1e6);
  },
} as any;

export interface OrdersServiceClient {
  updateOrderStatus(request: OrderUpdateStatusDto): Observable<OrderUpdateResponse>;

  findOrders(request: OrderFilterDto): Observable<Orders>;

  findOneOrder(request: FindOneOrderDto): Observable<Order>;

  findOrdersWithPagination(request: QueryOrderWithPagination): Observable<OrderWithPagination>;
}

export interface OrdersServiceController {
  updateOrderStatus(
    request: OrderUpdateStatusDto,
  ): Promise<OrderUpdateResponse> | Observable<OrderUpdateResponse> | OrderUpdateResponse;

  findOrders(request: OrderFilterDto): Promise<Orders> | Observable<Orders> | Orders;

  findOneOrder(request: FindOneOrderDto): Promise<Order> | Observable<Order> | Order;

  findOrdersWithPagination(
    request: QueryOrderWithPagination,
  ): Promise<OrderWithPagination> | Observable<OrderWithPagination> | OrderWithPagination;
}

export function OrdersServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      'updateOrderStatus',
      'findOrders',
      'findOneOrder',
      'findOrdersWithPagination',
    ];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod('OrdersService', method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod('OrdersService', method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const ORDERS_SERVICE_NAME = 'OrdersService';
