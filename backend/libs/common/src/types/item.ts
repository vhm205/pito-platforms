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
