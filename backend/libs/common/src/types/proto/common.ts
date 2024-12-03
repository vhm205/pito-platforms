/* eslint-disable */

export const protobufPackage = 'common';

export enum OrderType {
  PX = 0,
  PC = 1,
  PCC = 2,
  UNRECOGNIZED = -1,
}

export enum OrderStatus {
  DRAFT = 0,
  WAITING = 1,
  RECEIVED = 2,
  PROCESSING = 3,
  DELIVERING = 4,
  REFUNDING = 5,
  REFUNDED = 6,
  CANCELLED = 7,
  COMPLETED = 8,
  DELIVERY_FAILED = 9,
  UNRECOGNIZED = -1,
}

export enum PaymentMethod {
  PAYMENT_METHOD_QRCODE = 0,
  PAYMENT_METHOD_ATM = 1,
  PAYMENT_METHOD_VISA = 2,
  PAYMENT_METHOD_MASTERCARD = 3,
  PAYMENT_METHOD_JCB = 4,
  PAYMENT_METHOD_UPI = 5,
  PAYMENT_METHOD_AMEX = 6,
  UNRECOGNIZED = -1,
}

export interface PaginationRequest {
  currentPage: number;
  pageSize: number;
}

export interface PaginationMetadata {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalCount: number;
}

export interface FilterRule {
  column: string;
  operator: string;
  value: string;
}

export interface SortRule {
  column: string;
  direction: string;
}

export const COMMON_PACKAGE_NAME = 'common';
