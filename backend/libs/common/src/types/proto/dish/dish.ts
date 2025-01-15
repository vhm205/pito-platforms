/* eslint-disable */

export const protobufPackage = 'dish';

export interface PaginationRequest {
  currentPage: number;
  pageSize: number;
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

/** Dish message definition */
export interface Dish {
  id: string;
  name: string;
  quantity: number;
  quantityUnit: string;
  images: string[];
  storeId: string;
  partnerId: string;
  packageOptionId: number;
}

/** CreateDishRequest for creating a new dish */
export interface CreateDishRequest {
  name: string;
  quantity?: number | undefined;
  quantityUnit?: string | undefined;
  images: string[];
  storeId: string;
  partnerId: string;
  packageOptionId?: number | undefined;
}

/** CreateDishResponse for returning the created dish */
export interface CreateDishResponse {
  id: string;
}

/** GetDishRequest for retrieving a single dish by ID */
export interface GetDishRequest {
  id: string;
}

/** GetDishResponse for returning a single dish */
export interface GetDishResponse {
  dish: Dish | undefined;
}

/** ListDishesRequest for retrieving a list of dishes with pagination and filtering */
export interface ListDishesRequest {
  pagination: PaginationRequest | undefined;
  sorts: SortRule[];
  filters: FilterRule[];
}

/** ListDishesResponse for returning a list of dishes with pagination metadata */
export interface ListDishesResponse {
  dishes: Dish[];
  totalCount: number;
}

/** UpdateDishRequest for updating an existing dish */
export interface UpdateDishRequest {
  id: string;
  name?: string | undefined;
  quantity?: number | undefined;
  quantityUnit?: string | undefined;
  images: string[];
  storeId?: string | undefined;
  partnerId?: string | undefined;
  packageOptionId?: number | undefined;
}

/** UpdateDishResponse for returning the updated dish */
export interface UpdateDishResponse {
  affectedRows: number;
}

/** DeleteDishRequest for deleting a dish by ID */
export interface DeleteDishRequest {
  id: string;
}

/** DeleteDishResponse for confirming deletion */
export interface DeleteDishResponse {
  success: boolean;
}

export const DISH_PACKAGE_NAME = 'dish';
