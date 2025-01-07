// import { GetListPartnersResponse_Partner } from '@app/common';
import { ServiceType } from '@app/common/enums/partner';
import { MaybeType, NullableType } from '@app/common/types/common';
import { BusinessType, Certification } from '@app/common/types/proto/common';

// export class Partner implements GetListPartnersResponse_Partner {
//   id: string;
//   name: string;
//   status: string;
//   phoneNumber: string;
//   email: string;
//   businessType: BusinessType;
//   certificateType: Certification;
//   location: object;
//   createdAt: MaybeType<Date>;
//   updatedAt: MaybeType<Date>;
// }

export class BusinessInfo {
  tax_code: string;
  business_name: string;
  business_type: string;
  registration_date: string;
  registered_address: string;
  registration_number: string;
  business_licenses: string[];
}

export class BusinessOwner {
  email: string;
  phone: string;
  full_name: string;
  citizen_info: {
    citizen_id: string;
    issue_date: string;
    expiry_date: string;
    issue_place: string;
    citizen_images: Array<{
      path: string;
      type: string;
    }>;
    resident_address: string;
  };
}

export class BankAccountInfo {
  bank_name: string;
  bank_branch: string;
  account_holder: string;
  account_number: string;
  financial_manager: NullableType<{
    email: string;
    phone: string;
    full_name: string;
  }>;
}

export class Partner {
  id: string;
  name: string;
  status: string;
  businessType: BusinessType;
  certification: Certification;
  businessInfo: BusinessInfo;
  businessOwner: BusinessOwner;
  bankAccount: BankAccountInfo;
  createdAt: MaybeType<Date>;
  updatedAt: MaybeType<Date>;

  serviceFeeRate: number;
  serviceTypes: ServiceType[];
}
