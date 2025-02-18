export class StoreUser {
  id: string;
  fullName: string;
  email: string;
  phone?: string | undefined;
  avatarUrl?: string | undefined;
  storeUid: number;
  userRoles: string[];
  isBanned: boolean;
  createdAt: Date | undefined;
  updatedAt: Date | undefined;
}
