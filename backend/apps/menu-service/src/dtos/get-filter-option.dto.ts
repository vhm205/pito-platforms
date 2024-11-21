class FilterOption {
  id: number;
  name: string;
}

export class GetFilterOptionId {
  cuisineTypesIds: number[];
  specialDietariesIds: number[];
  occasionEventsIds: number[];
  serviceTypesIds: number[];
}

export class GetFilterOption {
  cuisineTypes: FilterOption[];
  specialDietaries: FilterOption[];
  occasionEvents: FilterOption[];
  serviceTypes: FilterOption[];
}
