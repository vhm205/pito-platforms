export interface Option {
  option_id: string;
  name: string;
  type: string;
  description?: string;
  is_required: boolean;
  max_choices: number;
  choices: {
    choice_id: string;
    name: string;
    base_price: number;
  }[];
}

export interface Item {
  name: string;
  options_and_choices: Option[];
}

export interface RawOptionChoice {
  option_id: string;
  choices: RawChoice[];
}

export interface RawChoice {
  choice_id: string;
  quantity: number;
}

export interface SelectedChoice {
  id: string;
  name: string;
  basePrice: number;
  quantity: number;
}

export interface SelectedOption {
  id: string;
  name: string;
  type: string;
  description?: string;
  choices: SelectedChoice[];
}
