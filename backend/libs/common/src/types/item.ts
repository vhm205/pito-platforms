export interface RawItemChoice {
  name: string;
  choice_id: string;
  is_active: boolean;
  base_price: number;
}

export interface RawItemOptionAndChoice {
  name: string;
  choices: RawItemChoice[];
  is_active: boolean;
  option_id: string;
  description: string;
  is_required: boolean;
  max_choices: number;
  is_multiple_choice: boolean;
  is_selection_quantity_allowed: boolean;
}

// Partner
export interface RawPartnerItemChoice {
  name: string;
  id: string;
  price: number;
}

export interface RawPartnerItemOptionAndChoice {
  name: string;
  choices: RawPartnerItemChoice[];
  id: string;
  description: string;
  is_required: boolean;
  max_choices: number;
  allow_multiple_selection: boolean;
  allow_quantity_selection: boolean;
  type?: string;
}

export interface RawPartnerItemMetadata {
  has_notes: boolean;
  has_utensils: boolean;
  rejection_reason?: string;
}

export interface RawItemServiceSettings {
  setup_time: number;
  service_time: number;
  service_person: number;
}
