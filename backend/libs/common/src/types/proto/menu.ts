/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from '@nestjs/microservices';
import { wrappers } from 'protobufjs';
import { Observable } from 'rxjs';
import {
  BusinessType,
  Certification,
  FilterRule,
  PaginationRequest,
  SortRule,
  StoreEngagementLevel,
  StorePerformanceLevel,
} from './common';
import {
  CreateDishRequest,
  CreateDishResponse,
  DeleteDishRequest,
  DeleteDishResponse,
  GetDishRequest,
  GetDishResponse,
  ListDishesRequest,
  ListDishesResponse,
  UpdateDishRequest,
  UpdateDishResponse,
} from './dish/dish';
import { Struct } from './google/protobuf/struct';
import {
  CreateOccasionEventRequest,
  CreateOccasionEventResponse,
  DeleteOccasionEventRequest,
  DeleteOccasionEventResponse,
  GetOccasionEventRequest,
  GetOccasionEventResponse,
  UpdateOccasionEventRequest,
  UpdateOccasionEventResponse,
} from './item/occasion-event';

export const protobufPackage = 'menu';

export interface BulkInsertItemsRequest {
  items: BulkInsertItemsRequest_Item[];
  storeId: string;
}

export interface BulkInsertItemsRequest_Item {
  name: string;
  basePrice?: number | undefined;
  description?: string | undefined;
  specialDietaries: number[];
  cuisineTypes: number[];
  occasionEvents: number[];
  driveFolderUrl?: string | undefined;
  minQuantity?: number | undefined;
  packagingType?: string | undefined;
  packagingUnit?: string | undefined;
  participant?: number | undefined;
  preparationTime?: number | undefined;
  optionsChoices: PartnerOptionsChoices[];
  metadata: Metadata | undefined;
  packageId?: string | undefined;
  categoryId?: string | undefined;
  serviceType: number;
  serviceSettings: ItemServiceSettings | undefined;
}

export interface BulkInsertItemsResponse {
  insertedCount: number;
}

export interface FindStoreIdsForPendingItemsRequest {
  serviceCategory?: string | undefined;
}

export interface FindStoreIdsForPendingItemsResponse {
  storeIds: string[];
}

export interface FindItemCountsByStoreIdsRequest {
  storeIds: string[];
  serviceCategory?: string | undefined;
  shouldFetchPendingItems?: boolean | undefined;
}

export interface FindItemCountsByStoreIdsResponse {
  data: FindItemCountsByStoreIdsResponse_StoreItemCount[];
}

export interface FindItemCountsByStoreIdsResponse_StoreItemCount {
  storeId: string;
  itemCount: number;
  menuStatus: string;
}

export interface FindOnboardingsRequest {
  pagination: PaginationRequest | undefined;
  sorts: SortRule[];
  filters: FilterRule[];
}

export interface FindOnboardingsResponse {
  onboardings: FindOnboardingsResponse_Onboarding[];
  totalCount: number;
}

export interface FindOnboardingsResponse_Onboarding {
  id: string;
  createdAt: Date | undefined;
  updatedAt: Date | undefined;
  rawOwnerMetadata: { [key: string]: any } | undefined;
  rawBusinessMetadata: { [key: string]: any } | undefined;
  rawBankAccountMetadata: { [key: string]: any } | undefined;
  status: string;
  emailConfirmation: string;
  partnerType: string;
  metadata: { [key: string]: any } | undefined;
}

/** [START] Find stores by filter */
export interface GetStoreByFilterRequest {
  /** Page number for pagination */
  page: number;
  /** Number of items per page */
  pageSize: number;
  /** Sort by field */
  sortBy?: string | undefined;
  filters?: StoreFilter | undefined;
}

export interface GetStoreByFilterResponse {
  stores: SearchStoreResult[];
  total: number;
}

export interface Store {
  id: string;
  partnerId: string;
  storeName: string;
  introduction: string;
  avatar: string;
  thumbnail: string;
  email: string;
  phone: string;
  isActive: boolean;
  isVat: boolean;
  starRating: number;
  timelinessRate: number;
  cover: string;
  menuStatus: string;
  cuisineTypes: number[];
  specialDietaries: number[];
  occasionEvents: number[];
  serviceTypes: number[];
  minParticipants: number;
  minPreparationTime: number;
  minOrderValue: number;
  storeCode: string;
  slug: string;
  status: string;
  openingHours: { [key: string]: Store_OpeningHours };
  updatedAt: Date | undefined;
}

export interface Store_OpeningHours {
  open: string;
  close: string;
}

export interface Store_OpeningHoursEntry {
  key: string;
  value: Store_OpeningHours | undefined;
}

export interface SearchStoreResult {
  store: Store | undefined;
  distance?: number | undefined;
  totalCompletedOrders: number;
  isOpen: boolean;
}

export interface StoreFilter {
  keyword?: string | undefined;
  shippingTime?: string | undefined;
  budgetRange?: StoreFilter_BudgetRangeFilter | undefined;
  shippingAddress?: StoreFilter_ShippingAddressFilter | undefined;
  occasionEvents: number[];
  specialDietaries: number[];
  serviceTypes: number[];
  cuisineTypes: number[];
  rating?: number | undefined;
}

export interface StoreFilter_ShippingAddressFilter {
  address: string;
  latitude: number;
  longitude: number;
}

export interface StoreFilter_BudgetRangeFilter {
  min: number;
  max: number;
}

/** [START] Find products in stores */
export interface GetItemInStoreRequest {
  /** Page number for pagination */
  page: number;
  /** Number of items per page */
  pageSize: number;
  /** Sort by field */
  sortBy: string;
  filters: ItemFilter | undefined;
}

export interface GetItemInStoreResponse {
  items: GetItemInStoreResult[];
  total: number;
}

export interface ItemFilter {
  storeId: string;
  keyword?: string | undefined;
  budgetRange?: ItemFilter_BudgetRangeFilter | undefined;
  occasionEvents: number[];
  specialDietaries: number[];
  serviceTypes: number[];
  cuisineTypes: number[];
}

export interface ItemFilter_BudgetRangeFilter {
  min: number;
  max: number;
}

export interface ChoiceOfOption {
  choiceId: string;
  name: string;
  basePrice: number;
  isActive: boolean;
}

export interface OptionAndChoice {
  optionId: string;
  name: string;
  isRequired: boolean;
  maxChoices: number;
  isMultipleChoice: boolean;
  isSelectionQuantityAllowed: boolean;
  choices: ChoiceOfOption[];
  isActive: boolean;
  description: string;
}

export interface Item {
  id: string;
  slug: string;
  name: string;
  basePrice: number;
  description: string;
  extraDescription: string;
  images: string[];
  storeId: string;
  minQuantity: number;
  maxQuantity: number;
  unitType: string;
  packagingType: string;
  eatingUtensil: string;
  specialNote: string;
  unitQuantity: number;
  preparationTime: number;
  optionsAndChoices: OptionAndChoice[];
  specialDietaries: number[];
  cuisineTypes: number[];
  occasionEvents: number[];
}

export interface GetItemInStoreResult {
  item: Item | undefined;
  specialDietaries: FilterOption[];
  cuisineTypes: FilterOption[];
  occasionEvents: FilterOption[];
}

/** [START] Get filter options */
export interface GetFilterOptionRequest {
  keyword: string;
}

export interface GetFilterOptionResponse {
  cuisineTypes: FilterOption[];
  occasionEvents: FilterOption[];
  serviceTypes: FilterOption[];
  specialDietaries: FilterOption[];
}

export interface FilterOption {
  id: number;
  name: string;
}

export interface Empty {}

/** PARTNER */
export interface Metadata {
  hasNotes: boolean;
  hasUtensils: boolean;
  rejectionReason?: string | undefined;
  diningTools: string[];
  hasFeedingService?: boolean | undefined;
}

export interface PartnerChoiceOfOption {
  id: string;
  name: string;
  price?: number | undefined;
  quantity?: number | undefined;
  quantityUnit?: string | undefined;
}

export interface PartnerOptionsChoices {
  id: string;
  allowMultipleSelection: boolean;
  allowQuantitySelection: boolean;
  name: string;
  description?: string | undefined;
  isRequired: boolean;
  maxChoices: number;
  choices: PartnerChoiceOfOption[];
  type?: string | undefined;
  maxQuantity?: number | undefined;
}

export interface ItemServiceSettings {
  setupTime: number;
  serviceTime: number;
  servicePerson: number;
}

export interface PartnerItemRequest {
  name: string;
  basePrice?: number | undefined;
  description?: string | undefined;
  specialDietaries: number[];
  cuisineTypes: number[];
  occasionEvents: number[];
  menuCategory: string;
  images: string[];
  minQuantity: number;
  packagingType?: string | undefined;
  packagingUnit?: string | undefined;
  participant: number;
  preparationTime: number;
  storeId: string;
  optionsChoices: PartnerOptionsChoices[];
  metadata: Metadata | undefined;
  menuId?: string | undefined;
  status?: string | undefined;
  orderDeadlineAt?: string | undefined;
  serviceType: number;
  serviceSettings: ItemServiceSettings | undefined;
}

export interface PartnerItem {
  id: string;
  name: string;
  basePrice: number;
  description: string;
  specialDietaries: FilterOption[];
  cuisineTypes: FilterOption[];
  occasionEvents: FilterOption[];
  menuCategory: string;
  images: string[];
  minQuantity: number;
  packagingType: string;
  packagingUnit: string;
  participant: number;
  preparationTime: number;
  storeId: string;
  optionsChoices: PartnerOptionsChoices[];
  metadata: Metadata | undefined;
  slug: string;
  status: string;
  orderDeadlineAt?: string | undefined;
  cateringPackages: number[];
  menuId: string;
  serviceType: number;
  serviceSettings: ItemServiceSettings | undefined;
  storeSlug?: string | undefined;
  version: number;
  serviceCategory?: string | undefined;
  createdAt?: Date | undefined;
  updatedAt?: Date | undefined;
}

export interface FindOccasionEventsResponse {
  occasionEvents: FilterOption[];
}

export interface FindCuisineTypesResponse {
  cuisineTypes: FilterOption[];
}

export interface FindSpecialDietariesResponse {
  specialDietaries: FilterOption[];
}

export interface FindStoresRequest {
  pagination: PaginationRequest | undefined;
  sorts: SortRule[];
  filters: FilterRule[];
}

export interface FindStoresResponse {
  stores: FindStoresResponse_StoreResponse[];
  totalCount: number;
}

export interface FindStoresResponse_StoreResponse {
  id: string;
  name: string;
  slug: string;
  description: string;
  storeCode: string;
  location: FindStoresResponse_StoreResponse_Location | undefined;
  contacts: FindStoresResponse_StoreResponse_ContactInfo[];
  isVat: boolean;
  bankAccount: FindStoresResponse_StoreResponse_BankAccount | undefined;
  createdAt: Date | undefined;
  updatedAt: Date | undefined;
  status: string;
  performanceLevel: StorePerformanceLevel;
  engagementLevel: StoreEngagementLevel;
}

export interface FindStoresResponse_StoreResponse_Location {
  ward: string;
  region: string;
  address: string;
  district: string;
  latitude: number;
  longitude: number;
}

export interface FindStoresResponse_StoreResponse_ContactInfo {
  email: string;
  phone: string;
  fullName: string;
}

export interface FindStoresResponse_StoreResponse_BankAccount {
  bankName: string;
  bankBranch: string;
  accountHolder: string;
  accountNumber: string;
}

export interface FindStoreRequest {
  id?: string | undefined;
  slug?: string | undefined;
}

export interface FindStoreResponse {
  store: FindStoreResponse_StoreResponse | undefined;
}

export interface FindStoreResponse_StoreResponse {
  id: string;
  name: string;
  slug: string;
  description: string;
  storeCode: string;
  location: FindStoreResponse_StoreResponse_Location | undefined;
  contacts: FindStoreResponse_StoreResponse_ContactInfo[];
}

export interface FindStoreResponse_StoreResponse_Location {
  ward: string;
  region: string;
  address: string;
  district: string;
  latitude: number;
  longitude: number;
}

export interface FindStoreResponse_StoreResponse_ContactInfo {
  email: string;
  phone: string;
  fullName: string;
}

export interface UpdateItemDetailsRequest {
  name?: string | undefined;
  basePrice?: number | undefined;
  description?: string | undefined;
  specialDietaries: number[];
  cuisineTypes: number[];
  occasionEvents: number[];
  menuCategory?: string | undefined;
  images: string[];
  minQuantity?: number | undefined;
  packagingType?: string | undefined;
  packagingUnit?: string | undefined;
  participant?: number | undefined;
  preparationTime?: number | undefined;
  storeId?: string | undefined;
  optionsChoices: PartnerOptionsChoices[];
  metadata?: Metadata | undefined;
  menuId?: string | undefined;
  status?: string | undefined;
  slug?: string | undefined;
  orderDeadlineAt?: string | undefined;
  serviceType?: number | undefined;
  serviceSettings?: ItemServiceSettings | undefined;
}

export interface UpdateItemRequest {
  id: string;
  updateItemRequest: UpdateItemDetailsRequest | undefined;
}

export interface FindItemsWithPaginationRequest {
  pagination: PaginationRequest | undefined;
  sorts: SortRule[];
  filters: FilterRule[];
  menuType?: string | undefined;
}

export interface FindItemsWithPaginationResponse {
  items: PartnerItem[];
  totalCount: number;
}

export interface FindItemsRequest {
  filters: FilterRule[];
}

export interface FindItemsResponse {
  data: FindItemsResponse_PartnerItem[];
  error?: string | undefined;
}

export interface FindItemsResponse_PartnerItem {
  id: string;
  name: string;
  basePrice: number;
  description: string;
  specialDietaries: number[];
  cuisineTypes: number[];
  occasionEvents: number[];
  menuCategory: string;
  images: string[];
  minQuantity: number;
  packagingType: string;
  packagingUnit: string;
  participant: number;
  preparationTime: number;
  storeId: string;
  optionsChoices: { [key: string]: any }[];
  metadata: { [key: string]: any } | undefined;
  slug: string;
  status: string;
  orderDeadlineAt?: string | undefined;
  distance?: number | undefined;
  serviceType: number;
  cateringPackages: number[];
}

export interface CalculateDistanceRequest {
  latitude: number;
  longitude: number;
  geolocation: string;
}

export interface CalculateDistanceResponse {
  distance: number;
}

export interface FindItemRequest {
  id?: string | undefined;
  slug?: string | undefined;
  status?: string | undefined;
}

export interface FindAllCateringPackagesResponse {
  cateringPackages: FindAllCateringPackagesResponse_CateringPackage[];
}

export interface FindAllCateringPackagesResponse_PackageOption {
  id: number;
  name: string;
}

export interface FindAllCateringPackagesResponse_CateringPackage {
  id: number;
  name: string;
  isActive: boolean;
  options: FindAllCateringPackagesResponse_PackageOption[];
}

export interface CateringPackage {
  id: number;
  name: string;
  isActive: boolean;
}

export interface FindAllCateringPackageOptionsRequest {
  sorts: SortRule[];
}

export interface FindAllCateringPackageOptionsResponse {
  options: FindAllCateringPackageOptionsResponse_CateringPackageOption[];
}

export interface FindAllCateringPackageOptionsResponse_CateringPackageOption {
  id: number;
  name: string;
  status: string;
}

export interface FindCateringPackagesAndOccasionEventsRequest {
  sorts: SortRule[];
}

export interface FindCateringPackagesAndOccasionEventsResponse {
  cateringPackages: FindCateringPackagesAndOccasionEventsResponse_CateringPackage[];
  occasionEvents: FindCateringPackagesAndOccasionEventsResponse_OccasionEvent[];
}

export interface FindCateringPackagesAndOccasionEventsResponse_OccasionEvent {
  id: number;
  name: string;
  isActive: boolean;
}

export interface FindCateringPackagesAndOccasionEventsResponse_PackageOption {
  id: number;
  name: string;
}

export interface FindCateringPackagesAndOccasionEventsResponse_CateringPackage {
  id: number;
  name: string;
  isActive: boolean;
  options: FindCateringPackagesAndOccasionEventsResponse_PackageOption[];
}

export interface FindItemsByFiltersRequest {
  pagination: PaginationRequest | undefined;
  sorts: SortRule[];
  filters: FilterRule[];
  latitude?: number | undefined;
  longitude?: number | undefined;
  menuType?: string | undefined;
}

export interface FindItemsByFiltersResponse {
  items: FindItemsByFiltersResponse_PartnerItem[];
  totalCount: number;
}

export interface FindItemsByFiltersResponse_ServiceSetting {
  setupTime: number;
  servicePerson: number;
  serviceTime: number;
}

export interface FindItemsByFiltersResponse_Store {
  status: string;
  reopenTime?: string | undefined;
  prepTimes: { [key: string]: any } | undefined;
}

export interface FindItemsByFiltersResponse_PartnerItem {
  id: string;
  name: string;
  basePrice: number;
  description: string;
  specialDietaries: FilterOption[];
  cuisineTypes: FilterOption[];
  occasionEvents: FilterOption[];
  menuCategory: string;
  images: string[];
  minQuantity: number;
  packagingType: string;
  packagingUnit: string;
  participant: number;
  preparationTime: number;
  storeId: string;
  optionsChoices: PartnerOptionsChoices[];
  metadata: Metadata | undefined;
  slug: string;
  status: string;
  orderDeadlineAt?: string | undefined;
  distance?: number | undefined;
  serviceType: number;
  serviceSettings: FindItemsByFiltersResponse_ServiceSetting | undefined;
  store: FindItemsByFiltersResponse_Store | undefined;
  serviceCategory: string;
  version: number;
}

export interface FilterItemsWithCateringPackageRequest {
  pagination: PaginationRequest | undefined;
  sorts: SortRule[];
  filters: FilterRule[];
}

export interface FilterItemsWithCateringPackageResponse {
  data: FilterItemsWithCateringPackageResponse_PartnerItem[];
  totalCount: number;
  error?: string | undefined;
}

export interface FilterItemsWithCateringPackageResponse_PartnerItem {
  id: string;
  name: string;
  basePrice: number;
  description: string;
  specialDietaries: number[];
  cuisineTypes: number[];
  occasionEvents: number[];
  menuCategory: string;
  images: string[];
  minQuantity: number;
  packagingType: string;
  packagingUnit: string;
  participant: number;
  preparationTime: number;
  storeId: string;
  optionsChoices: { [key: string]: any }[];
  metadata: { [key: string]: any } | undefined;
  slug: string;
  status: string;
  orderDeadlineAt?: string | undefined;
  distance?: number | undefined;
  serviceType: number;
}

export interface GetStoreDetailRequest {
  identifier: string;
}

export interface GetStoreDetailResponse {
  id: string;
  partnerId: string;
  name: string;
  storeCode: string;
  status: string;
  isVat: boolean;
  slug: string;
  description?: string | undefined;
  location: GetStoreDetailResponse_Location | undefined;
  images: GetStoreDetailResponse_Image | undefined;
  contacts: GetStoreDetailResponse_ContactInfo[];
  bankAccount: GetStoreDetailResponse_BankAccount | undefined;
  prepTimes: { [key: string]: any } | undefined;
  metadata: { [key: string]: any } | undefined;
  createdAt: Date | undefined;
  updatedAt: Date | undefined;
  /** additional */
  cuisineTypes: GetStoreDetailResponse_CuisineType[];
  reopenTime: Date | undefined;
  dailyOrderLimit: number;
  dailyRevenueLimit: number;
  minOrderPrice: number;
  isFavorite?: boolean | undefined;
  minPreOrderTime: number;
  shippingFeeSettings: GetStoreDetailResponse_ShippingFeeSettings | undefined;
}

export interface GetStoreDetailResponse_Location {
  ward: string;
  region: string;
  address: string;
  district: string;
  latitude: number;
  longitude: number;
}

export interface GetStoreDetailResponse_ContactInfo {
  email: string;
  phone: string;
  fullName: string;
}

export interface GetStoreDetailResponse_BankAccount {
  bankName: string;
  bankBranch: string;
  accountHolder: string;
  accountNumber: string;
}

export interface GetStoreDetailResponse_Image {
  cover: string;
  avatar: string;
  thumbnail: string;
}

export interface GetStoreDetailResponse_CuisineType {
  id: number;
  name: string;
}

export interface GetStoreDetailResponse_DistanceFee {
  startKm: number;
  endKm: number;
  feePerKm: number;
}

export interface GetStoreDetailResponse_Vehicle {
  baseFee: number;
  distanceFees: GetStoreDetailResponse_DistanceFee[];
  freeShippingDistance: number;
  freeShippingThreshold: number;
}

export interface GetStoreDetailResponse_ShippingFeeSettings {
  car: GetStoreDetailResponse_Vehicle | undefined;
  motorbike: GetStoreDetailResponse_Vehicle | undefined;
  thresholdSwitchToCar: number;
}

export interface GetStoreDetailForCustomerRequest {
  identifier: string;
  userId: string;
}

export interface UpdateStoreStatusRequest {
  ids: string[];
  status: string;
}

export interface UpdateStoreStatusResponse {
  success: boolean;
}

export interface UpdatePartnerStatusRequest {
  ids: string[];
  status: string;
}

export interface UpdatePartnerStatusResponse {
  success: boolean;
}

export interface GetListPartnersRequest {
  pagination: PaginationRequest | undefined;
  sorts: SortRule[];
  filters: FilterRule[];
}

export interface GetListPartnersResponse {
  data: GetListPartnersResponse_Partner[];
  totalCount: number;
  error?: string | undefined;
}

export interface GetListPartnersResponse_Partner {
  id: string;
  name: string;
  status: string;
  representativeContact: { [key: string]: any } | undefined;
  businessAddress: string;
  businessType: BusinessType;
  certification: Certification;
  createdAt: Date | undefined;
  updatedAt: Date | undefined;
  isVat: boolean;
}

export interface GetPartnerDetailsRequest {
  id: string;
}

export interface GetPartnerDetailsResponse {
  data?: GetPartnerDetailsResponse_Partner | undefined;
  error?: string | undefined;
}

export interface GetPartnerDetailsResponse_Partner {
  id: string;
  name: string;
  status: string;
  businessType: BusinessType;
  certification: Certification;
  createdAt: Date | undefined;
  updatedAt: Date | undefined;
  businessInfo: { [key: string]: any } | undefined;
  businessOwner: { [key: string]: any } | undefined;
  bankAccount: { [key: string]: any } | undefined;
  serviceTypes: string[];
  serviceFeeRate: number;
  isVat: boolean;
}

/** Catering Package */
export interface CreateCateringPackageRequest {
  name: string;
}

export interface CreateCateringPackageResponse {
  id: number;
}

export interface UpdateCateringPackageRequest {
  id: number;
  name?: string | undefined;
  isActive?: boolean | undefined;
}

export interface UpdateCateringPackageResponse {
  affectedRows: number;
}

export interface DeleteCateringPackageRequest {
  id: number;
}

export interface DeleteCateringPackageResponse {
  success: boolean;
}

/** Catering Package Option */
export interface GetCateringPackageOptionsRequest {
  packageId: number;
}

export interface CreateCateringPackageOptionRequest {
  name: string;
}

export interface CreateCateringPackageOptionResponse {
  id: number;
}

export interface UpdateCateringPackageOptionRequest {
  id: number;
  name?: string | undefined;
  status?: string | undefined;
}

export interface UpdateCateringPackageOptionResponse {
  affectedRows: number;
}

export interface DeleteCateringPackageOptionRequest {
  id: number;
}

export interface DeleteCateringPackageOptionResponse {
  success: boolean;
}

export interface CateringPackageOption {
  id: number;
  name: string;
  status: string;
}

export interface GetCateringPackageOptionsResponse {
  options: CateringPackageOption[];
}

export interface CountCateringPackagesItemsRequest {
  cateringPackageIds: number[];
  itemStatus: string[];
  serviceCategory: string;
}

export interface CountCateringPackagesItemsResponse {
  data: { [key: number]: number };
}

export interface CountCateringPackagesItemsResponse_DataEntry {
  key: number;
  value: number;
}

export interface FindCateringPackagesRequest {
  filters: FilterRule[];
}

export interface FindCateringPackagesResponse {
  data: CateringPackage[];
  error?: string | undefined;
}

export interface AssignOptionsToPackageRequest {
  packageId: number;
  optionIds: number[];
}

export interface AssignOptionsToPackageResponse {
  success: boolean;
}

export interface UpdateStoreRequest {
  id: string;
  storeName?: string | undefined;
  images?: UpdateStoreRequest_StoreImage | undefined;
  isVat?: boolean | undefined;
  description?: string | undefined;
  contacts: UpdateStoreRequest_StoreContactInfo[];
  location?: UpdateStoreRequest_StoreLocation | undefined;
  bankAccount?: UpdateStoreRequest_StoreBankAccount | undefined;
  engagementLevel?: number | undefined;
  performanceLevel?: number | undefined;
  metadata: UpdateStoreRequest_Metadata | undefined;
}

export interface UpdateStoreRequest_StoreContactInfo {
  email: string;
  phone: string;
  fullName: string;
}

export interface UpdateStoreRequest_StoreLocation {
  ward: string;
  region: string;
  address: string;
  district: string;
  latitude: number;
  longitude: number;
}

export interface UpdateStoreRequest_StoreBankAccount {
  bankName: string;
  bankBranch: string;
  accountHolder: string;
  accountNumber: string;
}

export interface UpdateStoreRequest_StoreImage {
  cover: string;
  avatar: string;
  thumbnail: string;
}

export interface UpdateStoreRequest_SectionInterval {
  open: string;
  close: string;
}

export interface UpdateStoreRequest_PrepTime {
  isActive: boolean;
  sectionIntervals: UpdateStoreRequest_SectionInterval[];
}

export interface UpdateStoreRequest_PrepTimes {
  monday: UpdateStoreRequest_PrepTime | undefined;
  tuesday: UpdateStoreRequest_PrepTime | undefined;
  wednesday: UpdateStoreRequest_PrepTime | undefined;
  thursday: UpdateStoreRequest_PrepTime | undefined;
  friday: UpdateStoreRequest_PrepTime | undefined;
  saturday: UpdateStoreRequest_PrepTime | undefined;
  sunday: UpdateStoreRequest_PrepTime | undefined;
}

export interface UpdateStoreRequest_Metadata {
  storeSlug: string;
  regionSlug: string;
}

export interface UpdateStoreResponse {
  affectedRows: number;
}

export interface UpdatePartnerRequest {
  id: string;
  name?: string | undefined;
  status?: string | undefined;
  serviceFeeRate?: number | undefined;
  businessType?: BusinessType | undefined;
  certification?: Certification | undefined;
  bankAccount: UpdatePartnerRequest_BankAccountInfo | undefined;
  businessInfo: UpdatePartnerRequest_BusinessInfo | undefined;
  businessOwner: UpdatePartnerRequest_BusinessOwner | undefined;
  isVat?: boolean | undefined;
  serviceTypes: string[];
}

export interface UpdatePartnerRequest_CitizenImage {
  path: string;
  type: string;
}

export interface UpdatePartnerRequest_CitizenInfo {
  citizenId: string;
  issueDate: string;
  expiryDate: string;
  issuePlace: string;
  citizenImages: UpdatePartnerRequest_CitizenImage[];
  residentAddress: string;
}

export interface UpdatePartnerRequest_BusinessOwner {
  email: string;
  phone: string;
  fullName: string;
  citizenInfo: UpdatePartnerRequest_CitizenInfo | undefined;
}

export interface UpdatePartnerRequest_BankFinancialManager {
  email: string;
  phone: string;
  fullName: string;
}

export interface UpdatePartnerRequest_BankAccountInfo {
  bankName: string;
  bankBranch: string;
  accountHolder: string;
  accountNumber: string;
  financialManager: UpdatePartnerRequest_BankFinancialManager | undefined;
}

export interface UpdatePartnerRequest_BusinessInfo {
  taxCode: string;
  businessName: string;
  businessType: string;
  registrationDate: string;
  registeredAddress: string;
  registrationNumber: string;
  businessLicenses: string[];
}

export interface UpdatePartnerResponse {
  affectedRows: number;
}

export const MENU_PACKAGE_NAME = 'menu';

wrappers['.google.protobuf.Timestamp'] = {
  fromObject(value: Date) {
    return { seconds: value.getTime() / 1000, nanos: (value.getTime() % 1000) * 1e6 };
  },
  toObject(message: { seconds: number; nanos: number }) {
    return new Date(message.seconds * 1000 + message.nanos / 1e6);
  },
} as any;

wrappers['.google.protobuf.Struct'] = { fromObject: Struct.wrap, toObject: Struct.unwrap } as any;

export interface MenusServiceClient {
  findStores(request: FindStoresRequest): Observable<FindStoresResponse>;

  findStore(request: FindStoreRequest): Observable<FindStoreResponse>;

  findStoresByFilter(request: GetStoreByFilterRequest): Observable<GetStoreByFilterResponse>;

  calculateDistance(request: CalculateDistanceRequest): Observable<CalculateDistanceResponse>;

  findItemsInStore(request: GetItemInStoreRequest): Observable<GetItemInStoreResponse>;

  findItemsWithPagination(
    request: FindItemsWithPaginationRequest,
  ): Observable<FindItemsWithPaginationResponse>;

  findItem(request: FindItemRequest): Observable<PartnerItem>;

  findItems(request: FindItemsRequest): Observable<FindItemsResponse>;

  findAllCateringPackages(request: Empty): Observable<FindAllCateringPackagesResponse>;

  findAllCateringPackageOptions(
    request: FindAllCateringPackageOptionsRequest,
  ): Observable<FindAllCateringPackageOptionsResponse>;

  findCateringPackages(
    request: FindCateringPackagesRequest,
  ): Observable<FindCateringPackagesResponse>;

  findCateringPackagesAndOccasionEvents(
    request: FindCateringPackagesAndOccasionEventsRequest,
  ): Observable<FindCateringPackagesAndOccasionEventsResponse>;

  findItemsByFilters(request: FindItemsByFiltersRequest): Observable<FindItemsByFiltersResponse>;

  filterItemsWithCateringPackage(
    request: FilterItemsWithCateringPackageRequest,
  ): Observable<FilterItemsWithCateringPackageResponse>;

  getFilterOptions(request: GetFilterOptionRequest): Observable<GetFilterOptionResponse>;

  getStoreDetail(request: GetStoreDetailRequest): Observable<GetStoreDetailResponse>;

  getStoreDetailForCustomer(
    request: GetStoreDetailForCustomerRequest,
  ): Observable<GetStoreDetailResponse>;

  insertMenuItem(request: PartnerItemRequest): Observable<PartnerItem>;

  bulkInsertItems(request: BulkInsertItemsRequest): Observable<BulkInsertItemsResponse>;

  updateMenuItem(request: UpdateItemRequest): Observable<PartnerItem>;

  updateStoreStatus(request: UpdateStoreStatusRequest): Observable<UpdateStoreStatusResponse>;

  updatePartnerStatus(request: UpdatePartnerStatusRequest): Observable<UpdatePartnerStatusResponse>;

  updateStore(request: UpdateStoreRequest): Observable<UpdateStoreResponse>;

  getListPartners(request: GetListPartnersRequest): Observable<GetListPartnersResponse>;

  getPartnerDetails(request: GetPartnerDetailsRequest): Observable<GetPartnerDetailsResponse>;

  updatePartner(request: UpdatePartnerRequest): Observable<UpdatePartnerResponse>;

  createCateringPackage(
    request: CreateCateringPackageRequest,
  ): Observable<CreateCateringPackageResponse>;

  updateCateringPackage(
    request: UpdateCateringPackageRequest,
  ): Observable<UpdateCateringPackageResponse>;

  deleteCateringPackage(
    request: DeleteCateringPackageRequest,
  ): Observable<DeleteCateringPackageResponse>;

  createCateringPackageOption(
    request: CreateCateringPackageOptionRequest,
  ): Observable<CreateCateringPackageOptionResponse>;

  updateCateringPackageOption(
    request: UpdateCateringPackageOptionRequest,
  ): Observable<UpdateCateringPackageOptionResponse>;

  deleteCateringPackageOption(
    request: DeleteCateringPackageOptionRequest,
  ): Observable<DeleteCateringPackageOptionResponse>;

  getCateringPackageOptions(
    request: GetCateringPackageOptionsRequest,
  ): Observable<GetCateringPackageOptionsResponse>;

  assignOptionsToPackage(
    request: AssignOptionsToPackageRequest,
  ): Observable<AssignOptionsToPackageResponse>;

  countCateringPackagesItems(
    request: CountCateringPackagesItemsRequest,
  ): Observable<CountCateringPackagesItemsResponse>;

  createDish(request: CreateDishRequest): Observable<CreateDishResponse>;

  getDish(request: GetDishRequest): Observable<GetDishResponse>;

  listDishes(request: ListDishesRequest): Observable<ListDishesResponse>;

  updateDish(request: UpdateDishRequest): Observable<UpdateDishResponse>;

  deleteDish(request: DeleteDishRequest): Observable<DeleteDishResponse>;

  createOccasionEvent(request: CreateOccasionEventRequest): Observable<CreateOccasionEventResponse>;

  getOccasionEvent(request: GetOccasionEventRequest): Observable<GetOccasionEventResponse>;

  updateOccasionEvent(request: UpdateOccasionEventRequest): Observable<UpdateOccasionEventResponse>;

  deleteOccasionEvent(request: DeleteOccasionEventRequest): Observable<DeleteOccasionEventResponse>;

  findOccasionEvents(request: Empty): Observable<FindOccasionEventsResponse>;

  findCuisineTypes(request: Empty): Observable<FindCuisineTypesResponse>;

  findSpecialDietaries(request: Empty): Observable<FindSpecialDietariesResponse>;

  findOnboardingsWithPagination(
    request: FindOnboardingsRequest,
  ): Observable<FindOnboardingsResponse>;

  findItemCountsByStoreIds(
    request: FindItemCountsByStoreIdsRequest,
  ): Observable<FindItemCountsByStoreIdsResponse>;

  findStoreIdsForPendingItems(
    request: FindStoreIdsForPendingItemsRequest,
  ): Observable<FindStoreIdsForPendingItemsResponse>;
}

export interface MenusServiceController {
  findStores(
    request: FindStoresRequest,
  ): Promise<FindStoresResponse> | Observable<FindStoresResponse> | FindStoresResponse;

  findStore(
    request: FindStoreRequest,
  ): Promise<FindStoreResponse> | Observable<FindStoreResponse> | FindStoreResponse;

  findStoresByFilter(
    request: GetStoreByFilterRequest,
  ):
    | Promise<GetStoreByFilterResponse>
    | Observable<GetStoreByFilterResponse>
    | GetStoreByFilterResponse;

  calculateDistance(
    request: CalculateDistanceRequest,
  ):
    | Promise<CalculateDistanceResponse>
    | Observable<CalculateDistanceResponse>
    | CalculateDistanceResponse;

  findItemsInStore(
    request: GetItemInStoreRequest,
  ): Promise<GetItemInStoreResponse> | Observable<GetItemInStoreResponse> | GetItemInStoreResponse;

  findItemsWithPagination(
    request: FindItemsWithPaginationRequest,
  ):
    | Promise<FindItemsWithPaginationResponse>
    | Observable<FindItemsWithPaginationResponse>
    | FindItemsWithPaginationResponse;

  findItem(request: FindItemRequest): Promise<PartnerItem> | Observable<PartnerItem> | PartnerItem;

  findItems(
    request: FindItemsRequest,
  ): Promise<FindItemsResponse> | Observable<FindItemsResponse> | FindItemsResponse;

  findAllCateringPackages(
    request: Empty,
  ):
    | Promise<FindAllCateringPackagesResponse>
    | Observable<FindAllCateringPackagesResponse>
    | FindAllCateringPackagesResponse;

  findAllCateringPackageOptions(
    request: FindAllCateringPackageOptionsRequest,
  ):
    | Promise<FindAllCateringPackageOptionsResponse>
    | Observable<FindAllCateringPackageOptionsResponse>
    | FindAllCateringPackageOptionsResponse;

  findCateringPackages(
    request: FindCateringPackagesRequest,
  ):
    | Promise<FindCateringPackagesResponse>
    | Observable<FindCateringPackagesResponse>
    | FindCateringPackagesResponse;

  findCateringPackagesAndOccasionEvents(
    request: FindCateringPackagesAndOccasionEventsRequest,
  ):
    | Promise<FindCateringPackagesAndOccasionEventsResponse>
    | Observable<FindCateringPackagesAndOccasionEventsResponse>
    | FindCateringPackagesAndOccasionEventsResponse;

  findItemsByFilters(
    request: FindItemsByFiltersRequest,
  ):
    | Promise<FindItemsByFiltersResponse>
    | Observable<FindItemsByFiltersResponse>
    | FindItemsByFiltersResponse;

  filterItemsWithCateringPackage(
    request: FilterItemsWithCateringPackageRequest,
  ):
    | Promise<FilterItemsWithCateringPackageResponse>
    | Observable<FilterItemsWithCateringPackageResponse>
    | FilterItemsWithCateringPackageResponse;

  getFilterOptions(
    request: GetFilterOptionRequest,
  ):
    | Promise<GetFilterOptionResponse>
    | Observable<GetFilterOptionResponse>
    | GetFilterOptionResponse;

  getStoreDetail(
    request: GetStoreDetailRequest,
  ): Promise<GetStoreDetailResponse> | Observable<GetStoreDetailResponse> | GetStoreDetailResponse;

  getStoreDetailForCustomer(
    request: GetStoreDetailForCustomerRequest,
  ): Promise<GetStoreDetailResponse> | Observable<GetStoreDetailResponse> | GetStoreDetailResponse;

  insertMenuItem(
    request: PartnerItemRequest,
  ): Promise<PartnerItem> | Observable<PartnerItem> | PartnerItem;

  bulkInsertItems(
    request: BulkInsertItemsRequest,
  ):
    | Promise<BulkInsertItemsResponse>
    | Observable<BulkInsertItemsResponse>
    | BulkInsertItemsResponse;

  updateMenuItem(
    request: UpdateItemRequest,
  ): Promise<PartnerItem> | Observable<PartnerItem> | PartnerItem;

  updateStoreStatus(
    request: UpdateStoreStatusRequest,
  ):
    | Promise<UpdateStoreStatusResponse>
    | Observable<UpdateStoreStatusResponse>
    | UpdateStoreStatusResponse;

  updatePartnerStatus(
    request: UpdatePartnerStatusRequest,
  ):
    | Promise<UpdatePartnerStatusResponse>
    | Observable<UpdatePartnerStatusResponse>
    | UpdatePartnerStatusResponse;

  updateStore(
    request: UpdateStoreRequest,
  ): Promise<UpdateStoreResponse> | Observable<UpdateStoreResponse> | UpdateStoreResponse;

  getListPartners(
    request: GetListPartnersRequest,
  ):
    | Promise<GetListPartnersResponse>
    | Observable<GetListPartnersResponse>
    | GetListPartnersResponse;

  getPartnerDetails(
    request: GetPartnerDetailsRequest,
  ):
    | Promise<GetPartnerDetailsResponse>
    | Observable<GetPartnerDetailsResponse>
    | GetPartnerDetailsResponse;

  updatePartner(
    request: UpdatePartnerRequest,
  ): Promise<UpdatePartnerResponse> | Observable<UpdatePartnerResponse> | UpdatePartnerResponse;

  createCateringPackage(
    request: CreateCateringPackageRequest,
  ):
    | Promise<CreateCateringPackageResponse>
    | Observable<CreateCateringPackageResponse>
    | CreateCateringPackageResponse;

  updateCateringPackage(
    request: UpdateCateringPackageRequest,
  ):
    | Promise<UpdateCateringPackageResponse>
    | Observable<UpdateCateringPackageResponse>
    | UpdateCateringPackageResponse;

  deleteCateringPackage(
    request: DeleteCateringPackageRequest,
  ):
    | Promise<DeleteCateringPackageResponse>
    | Observable<DeleteCateringPackageResponse>
    | DeleteCateringPackageResponse;

  createCateringPackageOption(
    request: CreateCateringPackageOptionRequest,
  ):
    | Promise<CreateCateringPackageOptionResponse>
    | Observable<CreateCateringPackageOptionResponse>
    | CreateCateringPackageOptionResponse;

  updateCateringPackageOption(
    request: UpdateCateringPackageOptionRequest,
  ):
    | Promise<UpdateCateringPackageOptionResponse>
    | Observable<UpdateCateringPackageOptionResponse>
    | UpdateCateringPackageOptionResponse;

  deleteCateringPackageOption(
    request: DeleteCateringPackageOptionRequest,
  ):
    | Promise<DeleteCateringPackageOptionResponse>
    | Observable<DeleteCateringPackageOptionResponse>
    | DeleteCateringPackageOptionResponse;

  getCateringPackageOptions(
    request: GetCateringPackageOptionsRequest,
  ):
    | Promise<GetCateringPackageOptionsResponse>
    | Observable<GetCateringPackageOptionsResponse>
    | GetCateringPackageOptionsResponse;

  assignOptionsToPackage(
    request: AssignOptionsToPackageRequest,
  ):
    | Promise<AssignOptionsToPackageResponse>
    | Observable<AssignOptionsToPackageResponse>
    | AssignOptionsToPackageResponse;

  countCateringPackagesItems(
    request: CountCateringPackagesItemsRequest,
  ):
    | Promise<CountCateringPackagesItemsResponse>
    | Observable<CountCateringPackagesItemsResponse>
    | CountCateringPackagesItemsResponse;

  createDish(
    request: CreateDishRequest,
  ): Promise<CreateDishResponse> | Observable<CreateDishResponse> | CreateDishResponse;

  getDish(
    request: GetDishRequest,
  ): Promise<GetDishResponse> | Observable<GetDishResponse> | GetDishResponse;

  listDishes(
    request: ListDishesRequest,
  ): Promise<ListDishesResponse> | Observable<ListDishesResponse> | ListDishesResponse;

  updateDish(
    request: UpdateDishRequest,
  ): Promise<UpdateDishResponse> | Observable<UpdateDishResponse> | UpdateDishResponse;

  deleteDish(
    request: DeleteDishRequest,
  ): Promise<DeleteDishResponse> | Observable<DeleteDishResponse> | DeleteDishResponse;

  createOccasionEvent(
    request: CreateOccasionEventRequest,
  ):
    | Promise<CreateOccasionEventResponse>
    | Observable<CreateOccasionEventResponse>
    | CreateOccasionEventResponse;

  getOccasionEvent(
    request: GetOccasionEventRequest,
  ):
    | Promise<GetOccasionEventResponse>
    | Observable<GetOccasionEventResponse>
    | GetOccasionEventResponse;

  updateOccasionEvent(
    request: UpdateOccasionEventRequest,
  ):
    | Promise<UpdateOccasionEventResponse>
    | Observable<UpdateOccasionEventResponse>
    | UpdateOccasionEventResponse;

  deleteOccasionEvent(
    request: DeleteOccasionEventRequest,
  ):
    | Promise<DeleteOccasionEventResponse>
    | Observable<DeleteOccasionEventResponse>
    | DeleteOccasionEventResponse;

  findOccasionEvents(
    request: Empty,
  ):
    | Promise<FindOccasionEventsResponse>
    | Observable<FindOccasionEventsResponse>
    | FindOccasionEventsResponse;

  findCuisineTypes(
    request: Empty,
  ):
    | Promise<FindCuisineTypesResponse>
    | Observable<FindCuisineTypesResponse>
    | FindCuisineTypesResponse;

  findSpecialDietaries(
    request: Empty,
  ):
    | Promise<FindSpecialDietariesResponse>
    | Observable<FindSpecialDietariesResponse>
    | FindSpecialDietariesResponse;

  findOnboardingsWithPagination(
    request: FindOnboardingsRequest,
  ):
    | Promise<FindOnboardingsResponse>
    | Observable<FindOnboardingsResponse>
    | FindOnboardingsResponse;

  findItemCountsByStoreIds(
    request: FindItemCountsByStoreIdsRequest,
  ):
    | Promise<FindItemCountsByStoreIdsResponse>
    | Observable<FindItemCountsByStoreIdsResponse>
    | FindItemCountsByStoreIdsResponse;

  findStoreIdsForPendingItems(
    request: FindStoreIdsForPendingItemsRequest,
  ):
    | Promise<FindStoreIdsForPendingItemsResponse>
    | Observable<FindStoreIdsForPendingItemsResponse>
    | FindStoreIdsForPendingItemsResponse;
}

export function MenusServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      'findStores',
      'findStore',
      'findStoresByFilter',
      'calculateDistance',
      'findItemsInStore',
      'findItemsWithPagination',
      'findItem',
      'findItems',
      'findAllCateringPackages',
      'findAllCateringPackageOptions',
      'findCateringPackages',
      'findCateringPackagesAndOccasionEvents',
      'findItemsByFilters',
      'filterItemsWithCateringPackage',
      'getFilterOptions',
      'getStoreDetail',
      'getStoreDetailForCustomer',
      'insertMenuItem',
      'bulkInsertItems',
      'updateMenuItem',
      'updateStoreStatus',
      'updatePartnerStatus',
      'updateStore',
      'getListPartners',
      'getPartnerDetails',
      'updatePartner',
      'createCateringPackage',
      'updateCateringPackage',
      'deleteCateringPackage',
      'createCateringPackageOption',
      'updateCateringPackageOption',
      'deleteCateringPackageOption',
      'getCateringPackageOptions',
      'assignOptionsToPackage',
      'countCateringPackagesItems',
      'createDish',
      'getDish',
      'listDishes',
      'updateDish',
      'deleteDish',
      'createOccasionEvent',
      'getOccasionEvent',
      'updateOccasionEvent',
      'deleteOccasionEvent',
      'findOccasionEvents',
      'findCuisineTypes',
      'findSpecialDietaries',
      'findOnboardingsWithPagination',
      'findItemCountsByStoreIds',
      'findStoreIdsForPendingItems',
    ];
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
