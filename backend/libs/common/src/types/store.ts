export interface OpeningHours {
  open: string;
  close: string;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface Location {
  ward: string;
  region: string;
  address: string;
  district: string;
  province: string;
  latitude: number;
  longitude: number;
  region_slug: string;
}

interface DistanceFee {
  end_km: number | null;
  start_km: number;
  fee_per_km: number;
}

interface Vehicle {
  base_fee: number;
  distance_fees: DistanceFee[];
  free_shipping_distance: number;
  free_shipping_threshold: number;
}

export interface ShippingFeeSetting {
  car: Vehicle;
  motorbike: Vehicle;
  threshold_switch_to_car: number;
}
