export enum SourceSystemType {
  PX = 'PX',
  PCC = 'PCC',
  PC = 'PC',
}

export enum ServiceFeeUnit {
  PERCENTAGE = 'percentage',
  FIXED = 'fixed',
}

export enum CacheExpiry {
  Minutes = 60,
  Hour = 60 * 60,
  Day = 60 * 60 * 24,
  Week = 60 * 60 * 24 * 7,
  Month = 60 * 60 * 24 * 30,
}
