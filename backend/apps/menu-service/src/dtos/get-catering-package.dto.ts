import { CateringPackage, OccasionEvents } from '../domain/partner-item.domain';

export class FindAllCateringPackageResponse {
  cateringPackages: CateringPackage[];
  occasionEvents: OccasionEvents[];
}
