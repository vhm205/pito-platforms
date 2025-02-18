export class SettingFee {
  id: number;
  name: string;
  type: string;
  value: number;
  isActive: boolean;
  serviceType: number[];
  key: string;
  createdAt: Date;
  updatedAt: Date | undefined;
}
