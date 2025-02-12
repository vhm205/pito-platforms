export abstract class StoreUserRelationshipRepository {
  abstract validateUserInStore(userId: string, storeId: string): Promise<boolean>;
}
