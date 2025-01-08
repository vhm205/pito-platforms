/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from '@nestjs/microservices';
import { wrappers } from 'protobufjs';
import { Observable } from 'rxjs';
import { Struct } from '../google/protobuf/struct';
import {
  FilterRule,
  OrderStatus,
  OrderType,
  PaginationRequest,
  PaymentMethod,
  SortRule,
} from './common';

export const protobufPackage = 'order';

/**
 * message OperatorNoteEntry {
 *   string description = 1;      // The note of the operation
 *   string timestamp = 2; // String format of the timestampz
 *   string user = 3; // The name of the user who created the note
 * }
 */
export interface UpdateOrderRequest {
  id: string;
  statusCode?: number | undefined;
  operatorStatusCode?: number | undefined;
  refundStatus?: number | undefined;
  metadata?: { [key: string]: any } | undefined;
}

/** Request message for UpdateOrderStatus */
export interface UpdateOrderStatusRequest {
  id: string;
  status: OrderStatus;
  cancelReason?: string | undefined;
  timestamp?: Date | undefined;
  deliveryEta?: number | undefined;
}

export interface UpdateOrderResponse {
  order: Order | undefined;
}

/** Request message for UpdateStoreOrderStatus */
export interface UpdateStoreOrderStatusRequest {
  id?: string | undefined;
  orderId?: string | undefined;
  status: OrderStatus;
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

export interface FindStoreOrdersRequest {
  pagination: PaginationRequest | undefined;
  sorts: SortRule[];
  filters: FilterRule[];
}

export interface FindStoreOrdersResponse {
  orders: StoreOrder[];
  totalCount: number;
}

/** Message for Order Items */
export interface OrderItem {
  totalPrice: number;
  quantity: number;
  /** repeated string raw_options_choices = 8; */
  notes: string;
  item: OrderItem_Item | undefined;
  rawOptionsChoices: OrderItem_RawOptionsChoices[];
}

export interface OrderItem_Item {
  id: string;
  name: string;
  slug: string;
  images: string[];
  basePrice: number;
  unitQuantity: number;
  optionsAndChoices: OrderItem_Item_OptionsAndChoices[];
}

export interface OrderItem_Item_OptionsAndChoices {
  optionId: string;
  name: string;
  choices: OrderItem_Item_OptionsAndChoices_Choice[];
}

export interface OrderItem_Item_OptionsAndChoices_Choice {
  choiceId: string;
  name: string;
  basePrice: number;
}

export interface OrderItem_RawOptionsChoices {
  optionId: string;
  choices: OrderItem_RawOptionsChoices_Choice[];
}

export interface OrderItem_RawOptionsChoices_Choice {
  quantity: number;
  choiceId: string;
}

/** Message for Order */
export interface Order {
  id: string;
  storeId: string;
  userId: string;
  orderType: OrderType;
  orderCode: string;
  /** Price-related fields */
  totalPrice: number;
  subTotalPrice: number;
  shippingFee: number;
  discountAmount: number;
  discountShippingFee: number;
  /** Payment method */
  paymentMethod: PaymentMethod;
  /**
   * Status and dates
   * common.OrderStatus status = 12;
   */
  statusCode: number;
  operatorStatusCode: number;
  deliveryAt: Date | undefined;
  deliveryFailedAt: Date | undefined;
  completedAt: Date | undefined;
  cancelledAt: Date | undefined;
  preparedAt: Date | undefined;
  confirmedAt: Date | undefined;
  /** Delivery-related information */
  receiverName: string;
  receiverPhone: string;
  deliveryAddress: string;
  deliveryEta: number;
  trackingUrl?: string | undefined;
  deliveryDate: Date | undefined;
  /** Cancellation and additional details */
  cancelReason?: string | undefined;
  deliveryLater: boolean;
  note?: string | undefined;
  orderItems: OrderItem[];
  vatInfo: { [key: string]: any } | undefined;
  orderCount: string;
  errorCode: number;
  metadata: { [key: string]: any } | undefined;
  receiverEmail: string;
  /** Timestamps */
  createdAt: Date | undefined;
  updatedAt: Date | undefined;
  preparingAt: Date | undefined;
  canceledByUser: boolean;
  refundStatus: number;
  refundedAt: Date | undefined;
}

/** Message for Store Order */
export interface StoreOrder {
  id: string;
  storeId: string;
  orderId: string;
  status: string;
  statusCode: number;
  orderCode: string;
  totalPrice: number;
  invoiceRequest?: StoreOrder_InvoiceRequest | undefined;
  metadata?: StoreOrder_StoreOrderMeta | undefined;
  invoiceStatus: number;
  paymentStatus: number;
  deliveryDate: Date | undefined;
}

export interface StoreOrder_InvoiceRequest {
  email: string;
  address: string;
  taxCode: string;
  companyName: string;
}

export interface StoreOrder_StoreOrderMeta {
  invoiceUrl?: string | undefined;
}

export interface Orders {
  orders: Order[];
  total: number;
}

/** GetOrderRequest with pagination */
export interface FindOrdersRequest {
  pagination: PaginationRequest | undefined;
  sorts: SortRule[];
  filters: FilterRule[];
}

export interface FindOrdersResponse {
  orders: Order[];
  totalCount: number;
}

export interface FindTransactionsRequest {
  pagination: PaginationRequest | undefined;
  sorts: SortRule[];
  filters: FilterRule[];
}

export interface FindTransactionsResponse {
  transactions: FindTransactionsResponse_Transaction[];
  totalCount: number;
}

export interface FindTransactionsResponse_Transaction {
  id: string;
  orderId: string;
  amount: number;
  billCode: string;
  transactionCode: string;
  bankAccountName: string;
  bankAccountNumber: string;
  createdAt: Date | undefined;
}

export interface GetRevenueAndCountOrderByStoreIdsRequest {
  ids: string[];
}

export interface GetRevenueAndCountOrderByStoreIdsResponse {
  storeRevenueAndCount: GetRevenueAndCountOrderByStoreIdsResponse_StoreRevenueAndCount[];
}

export interface GetRevenueAndCountOrderByStoreIdsResponse_StoreRevenueAndCount {
  storeId: string;
  totalOrders: number;
  totalRevenue: number;
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

wrappers['.google.protobuf.Struct'] = { fromObject: Struct.wrap, toObject: Struct.unwrap } as any;

export interface OrdersServiceClient {
  updateOrderStatus(request: UpdateOrderStatusRequest): Observable<UpdateOrderResponse>;

  updateStoreOrderStatus(
    request: UpdateStoreOrderStatusRequest,
  ): Observable<UpdateStoreOrderResponse>;

  updateOrder(request: UpdateOrderRequest): Observable<UpdateOrderResponse>;

  findOrder(request: FindOrderRequest): Observable<FindOrderResponse>;

  findOrders(request: FindOrdersRequest): Observable<FindOrdersResponse>;

  findStoreOrder(request: FindStoreOrderRequest): Observable<FindStoreOrderResponse>;

  findStoreOrders(request: FindStoreOrdersRequest): Observable<FindStoreOrdersResponse>;

  findTransactions(request: FindTransactionsRequest): Observable<FindTransactionsResponse>;

  getRevenueAndCountOrderByStoreIds(
    request: GetRevenueAndCountOrderByStoreIdsRequest,
  ): Observable<GetRevenueAndCountOrderByStoreIdsResponse>;
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

  updateOrder(
    request: UpdateOrderRequest,
  ): Promise<UpdateOrderResponse> | Observable<UpdateOrderResponse> | UpdateOrderResponse;

  findOrder(
    request: FindOrderRequest,
  ): Promise<FindOrderResponse> | Observable<FindOrderResponse> | FindOrderResponse;

  findOrders(
    request: FindOrdersRequest,
  ): Promise<FindOrdersResponse> | Observable<FindOrdersResponse> | FindOrdersResponse;

  findStoreOrder(
    request: FindStoreOrderRequest,
  ): Promise<FindStoreOrderResponse> | Observable<FindStoreOrderResponse> | FindStoreOrderResponse;

  findStoreOrders(
    request: FindStoreOrdersRequest,
  ):
    | Promise<FindStoreOrdersResponse>
    | Observable<FindStoreOrdersResponse>
    | FindStoreOrdersResponse;

  findTransactions(
    request: FindTransactionsRequest,
  ):
    | Promise<FindTransactionsResponse>
    | Observable<FindTransactionsResponse>
    | FindTransactionsResponse;

  getRevenueAndCountOrderByStoreIds(
    request: GetRevenueAndCountOrderByStoreIdsRequest,
  ):
    | Promise<GetRevenueAndCountOrderByStoreIdsResponse>
    | Observable<GetRevenueAndCountOrderByStoreIdsResponse>
    | GetRevenueAndCountOrderByStoreIdsResponse;
}

export function OrdersServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      'updateOrderStatus',
      'updateStoreOrderStatus',
      'updateOrder',
      'findOrder',
      'findOrders',
      'findStoreOrder',
      'findStoreOrders',
      'findTransactions',
      'getRevenueAndCountOrderByStoreIds',
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
