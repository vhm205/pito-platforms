export function collectUniqueValues(
  data: Array<{
    cuisineTypes: number[];
    specialDietaries: number[];
    occasionEvents: number[];
    serviceTypes: number[];
  }>,
) {
  const collections = {
    cuisineTypes: new Set<number>(),
    specialDietaries: new Set<number>(),
    occasionEvents: new Set<number>(),
    serviceTypes: new Set<number>(),
  };

  data.forEach(item => {
    if (item.cuisineTypes) {
      item.cuisineTypes.forEach(type => collections.cuisineTypes.add(type));
    }
    if (item.specialDietaries) {
      item.specialDietaries.forEach(diet => collections.specialDietaries.add(diet));
    }
    if (item.occasionEvents) {
      item.occasionEvents.forEach(event => collections.occasionEvents.add(event));
    }
    if (item.serviceTypes) {
      item.serviceTypes.forEach(service => collections.serviceTypes.add(service));
    }
  });

  return {
    cuisineTypesIds: Array.from(collections.cuisineTypes),
    specialDietariesIds: Array.from(collections.specialDietaries),
    occasionEventsIds: Array.from(collections.occasionEvents),
    serviceTypesIds: Array.from(collections.serviceTypes),
  };
}

export function mergeFilterOptions(filterOptions: any): any {
  const mergedFilterOptions: Record<string, string[]> = {};

  // Iterate through the keys in `filterOptionsOfStore`
  Object.keys(filterOptions.filterOptionsOfStore).forEach(key => {
    const storeValues = filterOptions.filterOptionsOfStore[key];
    const itemValues = filterOptions.filterOptionsOfItem[key];

    // Merge arrays and remove duplicates
    // const mergedValues = Array.from(new Set([...(storeValues || []), ...(itemValues || [])]));

    // Merge arrays, filter only numeric strings, and remove duplicates
    const mergedValues = Array.from(
      new Set([
        ...(storeValues || []).filter(val => typeof val === 'string' && /^\d+$/.test(val)),
        ...(itemValues || []).filter(val => typeof val === 'string' && /^\d+$/.test(val)),
      ]),
    );

    mergedFilterOptions[key] = mergedValues;
  });

  return mergedFilterOptions;
}
