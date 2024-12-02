import { Item } from '../domain/item.domain';

export class GetItemInStoreFilterDto {
  keyword?: string | undefined;
  sid: string; // store_id
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

export class GetItemInStoreDto {
  id: string;
  slug: string;
  name: string;
  base_price: number;
  description: string;
  extra_description: string;
  images: string[];
  store_id: string;
  special_dietaries: FilterOption[];
  cuisine_types: FilterOption[];
  occasion_events: FilterOption[];
  min_quantity: number;
  max_quantity: number;
  unit_type: string;
  packaging_type: string;
  eating_utensil: string;
  special_note: string;
  preparation_time: number;
  unit_quantity: number;
  options_and_choices: Array<RawOption>;
  total_records: number;
}

export class GetItemInStoreResult {
  item: Item;
  specialDietaries: FilterOption[];
  cuisineTypes: FilterOption[];
  occasionEvents: FilterOption[];
}

interface FilterOption {
  id: number;
  name: string;
}

interface RawChoice {
  choice_id: string;
  name: string;
  is_active: boolean;
  base_price: number;
}

interface RawOption {
  option_id: string;
  name: string;
  max_choices: number;
  is_active: boolean;
  is_required: boolean;
  is_multiple_choice: boolean;
  is_selection_quantity_allowed: boolean;
  description?: string;
  choices: Array<RawChoice>;
}
