import { StoreUser } from '../../domain/store-user.domain';

export abstract class StoreUserRelationshipRepository {
  abstract validateUserInStore(userId: string, storeId: string): Promise<boolean>;
  abstract getStoreUsers(storeId: string): Promise<[StoreUser[], number]>;
}
