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
  WAITING_FOR_DEPOSIT = 1,
  PAYMENT_FAILED = 10,
  WAITING_FOR_CONFIRMATION = 20,
  CANCELED = 30,
  REJECTED = 31,
  CONFIRMED = 40,
  UNCONFIRMED = 41,
  PREPARING = 50,
  PREPARED = 51,
  DELIVERING = 60,
  DELIVERY_FAILED = 61,
  COMPLETED = 100,
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
