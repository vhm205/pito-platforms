export class CateringPackage {
  id: number;
  name: string;
  isActive: boolean;
}

export class CateringPackageOption {
  id: number;
  name: string;
  status: string;
  packageId: number;
}
