import { Item } from '../domain/item.domain';

interface FilterOption {
  id: number;
  name: string;
}

export class GetItemInStoreFilterDto {
  keyword?: string | undefined;
  storeId: string;
  budgetMin?: number | undefined;
  budgetMax?: number | undefined;
  occasionEvents: number[];
  specialDietaries: number[];
  serviceTypes: number[];
  cuisineTypes: number[];
  sortBy?: string | undefined;
  page: number;
  pageSize: number;
}

export class SearchItemsInStoreResult {
  item: Item;
  specialDietaries: FilterOption[];
  cuisineTypes: FilterOption[];
  occasionEvents: FilterOption[];
}

// export interface SearchItemsInStoreResult {
//   id: string;
//   slug: string;
//   name: string;
//   basePrice: number;
//   description: string;
//   extraDescription: string;
//   images: any;
//   storeId: string;
//   specialDietaries: Array<{ id: number; name: string }>;
//   cuisineTypes: Array<{ id: number; name: string }>;
//   occasionEvents: Array<{ id: number; name: string }>;
//   minQuantity: number;
//   maxQuantity: number;
//   unitType: string;
//   packagingType: string;
//   eatingUtensil: string;
//   specialNote: string;
//   preparationTime: number;
//   unitQuantity: number;
//   optionsAndChoices: any;
//   totalRecords: number;
//   orderDeadlineAt: Date;
// }
