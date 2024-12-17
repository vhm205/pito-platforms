export enum UnitType {
  PERSON = 'person',
  PAX = 'pax',
  SET = 'set',
  PART = 'part',
  BOX = 'box',
  BOTTLE = 'bottle',
  TRAY = 'tray',
}

export enum PackagingType {
  BAGASSE = 'bagasse',
  PAPER = 'paper',
  PLASTIC_FOAM = 'plastic_foam',
  ALUMINUM_TRAY = 'aluminum_tray',
  REUSABLE_PACKAGING = 'reusable_packaging',
  GLASS = 'glass',
}

export enum EatingUtensil {
  YES = 'yes',
  NO = 'no',
}

export enum ItemStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  UNSTOCKED = 'unstocked',
  PENDING_APPROVAL = 'pending_approval',
  REJECTED = 'rejected',
  APPROVED = 'approved',
  DRAFT = 'draft',
}
