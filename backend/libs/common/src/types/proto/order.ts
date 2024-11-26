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

/** Request message for UpdateOrderStatus */
export interface UpdateOrderStatusRequest {
  id: string;
  status: string;
  cancelReason?: string | undefined;
  timestamp?: Date | undefined;
  deliveryEta?: number | undefined;
}

export interface UpdateOrderResponse {
  order: Order | undefined;
}

/** Request message for UpdateStoreOrderStatus */
export interface UpdateStoreOrderStatusRequest {
  id: string;
  status: string;
}

export interface UpdateStoreOrderResponse {
  id: string;
  status: string;
}

/** Request message for FindOrder */
export interface FindOrderRequest {
  id?: string | undefined;
  orderCode?: string | undefined;
  status?: string | undefined;
}

export interface FindOrderResponse {
  order: Order | undefined;
}

/** Request message for FindStoreOrder */
export interface FindStoreOrderRequest {
  id?: string | undefined;
  orderCode?: string | undefined;
  orderId?: string | undefined;
  status?: string | undefined;
}

export interface FindStoreOrderResponse {
  storeOrder: StoreOrder | undefined;
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
  id: string;
  orderCode: string;
  totalPrice: number;
  status: string;
  paymentMethod: string;
  createdAt: Date | undefined;
  deliveryDate: Date | undefined;
}

/** Message for Store Order */
export interface StoreOrder {
  id: string;
  status: string;
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
  updateOrderStatus(request: UpdateOrderStatusRequest): Observable<UpdateOrderResponse>;

  updateStoreOrderStatus(
    request: UpdateStoreOrderStatusRequest,
  ): Observable<UpdateStoreOrderResponse>;

  findOrder(request: FindOrderRequest): Observable<FindOrderResponse>;

  findStoreOrder(request: FindStoreOrderRequest): Observable<FindStoreOrderResponse>;

  findOrders(request: OrderFilterDto): Observable<Orders>;

  findOrdersWithPagination(request: QueryOrderWithPagination): Observable<OrderWithPagination>;
}

export interface OrdersServiceController {
  updateOrderStatus(
    request: UpdateOrderStatusRequest,
  ): Promise<UpdateOrderResponse> | Observable<UpdateOrderResponse> | UpdateOrderResponse;

  updateStoreOrderStatus(
    request: UpdateStoreOrderStatusRequest,
  ):
    | Promise<UpdateStoreOrderResponse>
    | Observable<UpdateStoreOrderResponse>
    | UpdateStoreOrderResponse;

  findOrder(
    request: FindOrderRequest,
  ): Promise<FindOrderResponse> | Observable<FindOrderResponse> | FindOrderResponse;

  findStoreOrder(
    request: FindStoreOrderRequest,
  ): Promise<FindStoreOrderResponse> | Observable<FindStoreOrderResponse> | FindStoreOrderResponse;

  findOrders(request: OrderFilterDto): Promise<Orders> | Observable<Orders> | Orders;

  findOrdersWithPagination(
    request: QueryOrderWithPagination,
  ): Promise<OrderWithPagination> | Observable<OrderWithPagination> | OrderWithPagination;
}

export function OrdersServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      'updateOrderStatus',
      'updateStoreOrderStatus',
      'findOrder',
      'findStoreOrder',
      'findOrders',
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
