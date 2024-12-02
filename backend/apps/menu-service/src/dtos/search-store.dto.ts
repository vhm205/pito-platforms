import { Store } from '../domain/store.domain';

export class SortSearchStoreDto {
  column: 'distance' | 'rating' | 'price';
  direction: 'ASC' | 'DESC';
}

export class SearchStoreFilterDto {
  longitude?: number | undefined;
  latitude?: number | undefined;
  budgetMin?: number | undefined;
  budgetMax?: number | undefined;
  rating?: number | undefined;
  limitDistance: number;
  occasionEvents?: number[];
  specialDietaries?: number[];
  serviceTypes?: number[];
  cuisineTypes?: number[];
  keyword?: string | undefined;
  shippingTime: string;
  sortBy?: string | undefined;
  page: number;
  pageSize: number;
}

export class SearchStoreDto {
  id: string;
  status: string;
  slug: string;
  store_name: string;
  is_vat: boolean;
  star_rating: number;
  avatar: string;
  thumbnail: string;
  cover: string;
  min_order_value: number;
  min_preparation_time: number;
  min_participants: number;
  cuisine_types: number[];
  special_dietaries: number[];
  occasion_events: number[];
  service_types: number[];
  services_available: number[];
  opening_hours: Record<string, OpeningHours>;
  dist_meters: number;
  is_open: boolean;
  timeliness_rate: string;
  total_completed_orders: string;
  total_records: number;
}

export class FindStoreByFilterResult {
  store: Store;
  distance: number | undefined;
  totalCompletedOrders: number;
  isOpen: boolean;
}

interface OpeningHours {
  open: string;
  close: string;
}
