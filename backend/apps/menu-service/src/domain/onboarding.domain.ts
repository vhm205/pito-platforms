import { FindOnboardingsResponse_Onboarding as OnboardingMessage } from '@app/common';
import { OnboardingStatus, PartnerType } from '@app/common/enums/partner';
import { NullableType } from '@app/common/types/common';

export class Onboarding {
  id: string;
  createdAt: Date;
  updatedAt: NullableType<Date>;
  rawOwnerMetadata: Record<string, unknown>;
  rawBusinessMetadata: Record<string, unknown>;
  rawBankAccountMetadata: Record<string, unknown>;
  status: OnboardingStatus;
  emailConfirmation: string;
  partnerType: PartnerType;
  metadata: NullableType<Record<string, unknown>>;

  toMessage(): OnboardingMessage {
    return {
      id: this.id,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt ?? undefined,
      rawOwnerMetadata: this.rawOwnerMetadata,
      rawBusinessMetadata: this.rawBusinessMetadata,
      rawBankAccountMetadata: this.rawBankAccountMetadata,
      status: this.status,
      emailConfirmation: this.emailConfirmation,
      partnerType: this.partnerType,
      metadata: this.metadata ?? undefined,
    };
  }
}
