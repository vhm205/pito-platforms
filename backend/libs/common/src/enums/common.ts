export enum AppVersion {
  V1 = 1,
  V2 = 2,
}

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

export enum DelayTime {
  Millis = 1,
  Second = 1000 * Millis,
  Minute = 60 * Second,
  Hour = 60 * Minute,
  Day = 24 * Hour,
  Week = 7 * Day,
  Month = 30 * Day,
}
