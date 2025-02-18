/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from '@nestjs/microservices';
import { wrappers } from 'protobufjs';
import { Observable } from 'rxjs';
import { FilterRule, PaginationRequest, SortRule } from './common';
import { Struct } from './google/protobuf/struct';

export const protobufPackage = 'user';

export interface GetCustomerProfileRequest {
  userId: string;
}

export interface GetCustomerProfileResponse {
  id: string;
  email: string;
  phone?: string | undefined;
  firstName: string;
  lastName: string;
  avatar?: string | undefined;
  thumbnail?: string | undefined;
  contactAddress?: string | undefined;
  deliveryAddresses: GetCustomerProfileResponse_DeliveryAddress[];
  createdAt: Date | undefined;
  updatedAt: Date | undefined;
  status: number;
  companyId?: string | undefined;
}

export interface GetCustomerProfileResponse_DeliveryAddress {
  id: string;
  name: string;
  label: string;
  type: string;
  default: boolean;
  building: string;
  companyName: string;
  numberOfApartment: string;
  createdAt: string;
  geometry: GetCustomerProfileResponse_DeliveryAddress_Geometry | undefined;
}

export interface GetCustomerProfileResponse_DeliveryAddress_Geometry {
  point: number[];
}

export interface GetPartnerProfileRequest {
  userId: string;
}

export interface GetPartnerProfileResponse {
  id: string;
  createdAt: Date | undefined;
  partnerName: string;
  updatedAt: Date | undefined;
  isActive: boolean;
  status: string;
  businessInfo: GetPartnerProfileResponse_BusinessInfo | undefined;
  businessOwner: GetPartnerProfileResponse_BusinessOwner | undefined;
  bankAccount: GetPartnerProfileResponse_BankAccount | undefined;
  partnerType: string;
  serviceTypes: string[];
  /** Use int32 for smallint */
  serviceFeeRate?: number | undefined;
  isVat: boolean;
}

export interface GetPartnerProfileResponse_BankAccount {
  bankName: string;
  bankBranch: string;
  accountHolder: string;
  accountNumber: string;
}

export interface GetPartnerProfileResponse_BusinessInfo {
  taxCode: string;
  businessName: string;
  businessType: string;
  registrationDate: string;
  registrationAddress: string;
  registrationNumber: string;
}

export interface GetPartnerProfileResponse_BusinessOwner {
  email: string;
  phone: string;
  fullName: string;
}

export interface GetOperatorProfileRequest {
  userId: string;
}

export interface GetOperatorProfileResponse {
  id: string;
  createdAt: Date | undefined;
  updatedAt: Date | undefined;
  name: string;
  email: string;
  phone?: string | undefined;
  metadata: { [key: string]: any } | undefined;
  avatarUrl?: string | undefined;
  firstName?: string | undefined;
  lastName?: string | undefined;
}

export interface GetUserPartnerProfileRequest {
  userId: string;
}

export interface GetUserPartnerProfileResponse {
  id: string;
  fullName?: string | undefined;
  email: string;
  phone?: string | undefined;
  avatarUrl?: string | undefined;
  createdAt: Date | undefined;
  updatedAt: Date | undefined;
  roles: string[];
}

export interface Empty {}

export interface GetCustomersRequest {
  pagination: PaginationRequest | undefined;
  sorts: SortRule[];
  filters: FilterRule[];
}

export interface GetCustomersResponse {
  data: GetCustomerProfileResponse[];
  totalCount: number;
  error?: string | undefined;
}

export interface GetCompaniesRequest {
  pagination: PaginationRequest | undefined;
  sorts: SortRule[];
  filters: FilterRule[];
}

export interface GetCompaniesResponse {
  data: GetCompaniesResponse_Company[];
  totalCount: number;
  error?: string | undefined;
}

export interface GetCompaniesResponse_Company {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  taxCode: string;
  createdAt: Date | undefined;
  updatedAt: Date | undefined;
}

export interface ValidateUserInPartnerRequest {
  userId: string;
  partnerId: string;
}

export interface ValidateUserInStoreRequest {
  userId: string;
  storeId: string;
}

export interface BooleanResponse {
  value: boolean;
}

export interface GetUsersInStoreRequest {
  storeId: string;
  filters: FilterRule[];
  pagination: PaginationRequest | undefined;
  sorts: SortRule[];
}

export interface GetUsersInStoreResponse {
  data: GetUsersInStoreResponse_UserInStore[];
  totalCount: number;
  error?: string | undefined;
}

export interface GetUsersInStoreResponse_UserInStore {
  id: string;
  fullName: string;
  email: string;
  phone?: string | undefined;
  avatarUrl?: string | undefined;
  storeUid: number;
  userRoles: string[];
  isBanned: boolean;
  createdAt: Date | undefined;
  updatedAt: Date | undefined;
}

export const USER_PACKAGE_NAME = 'user';

wrappers['.google.protobuf.Timestamp'] = {
  fromObject(value: Date) {
    return { seconds: value.getTime() / 1000, nanos: (value.getTime() % 1000) * 1e6 };
  },
  toObject(message: { seconds: number; nanos: number }) {
    return new Date(message.seconds * 1000 + message.nanos / 1e6);
  },
} as any;

wrappers['.google.protobuf.Struct'] = { fromObject: Struct.wrap, toObject: Struct.unwrap } as any;

export interface UsersServiceClient {
  getCustomerProfile(request: GetCustomerProfileRequest): Observable<GetCustomerProfileResponse>;

  getPartnerProfile(
    request: GetUserPartnerProfileRequest,
  ): Observable<GetUserPartnerProfileResponse>;

  getOperatorProfile(
    request: GetUserPartnerProfileRequest,
  ): Observable<GetUserPartnerProfileResponse>;

  /** rpc QueryUsers (stream PaginationDto) returns (stream Users) {} */

  getCustomers(request: GetCustomersRequest): Observable<GetCustomersResponse>;

  getCompanies(request: GetCompaniesRequest): Observable<GetCompaniesResponse>;

  validateUserInPartner(request: ValidateUserInPartnerRequest): Observable<BooleanResponse>;

  validateUserInStore(request: ValidateUserInStoreRequest): Observable<BooleanResponse>;

  getUsersInStore(request: GetUsersInStoreRequest): Observable<GetUsersInStoreResponse>;
}

export interface UsersServiceController {
  getCustomerProfile(
    request: GetCustomerProfileRequest,
  ):
    | Promise<GetCustomerProfileResponse>
    | Observable<GetCustomerProfileResponse>
    | GetCustomerProfileResponse;

  getPartnerProfile(
    request: GetUserPartnerProfileRequest,
  ):
    | Promise<GetUserPartnerProfileResponse>
    | Observable<GetUserPartnerProfileResponse>
    | GetUserPartnerProfileResponse;

  getOperatorProfile(
    request: GetUserPartnerProfileRequest,
  ):
    | Promise<GetUserPartnerProfileResponse>
    | Observable<GetUserPartnerProfileResponse>
    | GetUserPartnerProfileResponse;

  /** rpc QueryUsers (stream PaginationDto) returns (stream Users) {} */

  getCustomers(
    request: GetCustomersRequest,
  ): Promise<GetCustomersResponse> | Observable<GetCustomersResponse> | GetCustomersResponse;

  getCompanies(
    request: GetCompaniesRequest,
  ): Promise<GetCompaniesResponse> | Observable<GetCompaniesResponse> | GetCompaniesResponse;

  validateUserInPartner(
    request: ValidateUserInPartnerRequest,
  ): Promise<BooleanResponse> | Observable<BooleanResponse> | BooleanResponse;

  validateUserInStore(
    request: ValidateUserInStoreRequest,
  ): Promise<BooleanResponse> | Observable<BooleanResponse> | BooleanResponse;

  getUsersInStore(
    request: GetUsersInStoreRequest,
  ):
    | Promise<GetUsersInStoreResponse>
    | Observable<GetUsersInStoreResponse>
    | GetUsersInStoreResponse;
}

export function UsersServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      'getCustomerProfile',
      'getPartnerProfile',
      'getOperatorProfile',
      'getCustomers',
      'getCompanies',
      'validateUserInPartner',
      'validateUserInStore',
      'getUsersInStore',
    ];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod('UsersService', method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod('UsersService', method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const USERS_SERVICE_NAME = 'UsersService';
