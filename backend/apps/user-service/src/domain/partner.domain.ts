import { PartnerStatus, PartnerType } from '@app/common/enums/partner';
import { NullableType } from '@app/common/types/common';

export interface BankAccount {
  bankName: string;
  bankBranch: string;
  accountHolder: string;
  accountNumber: string;
}

export interface BusinessInfo {
  taxCode: string;
  businessName: string;
  businessType: string;
  registrationDate: string;
  registrationAddress: string;
  registrationNumber: string;
}

export interface BusinessOwner {
  email: string;
  phone: string;
  fullName: string;
}

export class Partner {
  id: string;
  createdAt: Date;
  partnerName: string;
  updatedAt: NullableType<Date>;
  isActive: boolean;
  status: PartnerStatus;
  bankAccount: NullableType<BankAccount>;
  businessInfo: NullableType<BusinessInfo>;
  partnerType: NullableType<PartnerType>;
  businessOwner: NullableType<BusinessOwner>;
  serviceTypes: NullableType<string[]>;
  serviceFeeRate: NullableType<number>;
  isVat: NullableType<boolean>;

  toMessage() {
    return {
      id: this.id,
      partnerName: this.partnerName,
      isActive: this.isActive,
      status: this.status,
      bankAccount: this.bankAccount as BankAccount,
      businessInfo: this.businessInfo as BusinessInfo,
      businessOwner: this.businessOwner as BusinessOwner,
      partnerType: this.partnerType as string,
      serviceTypes: this.serviceTypes as string[],
      serviceFeeRate: this.serviceFeeRate as number,
      isVat: this.isVat as boolean,
      createdAt: this.createdAt as Date,
      updatedAt: this.updatedAt as Date,
    };
  }
}
