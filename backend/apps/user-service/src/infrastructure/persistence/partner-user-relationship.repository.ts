export abstract class PartnerUserRelationshipRepository {
  abstract validateUserInPartner(userId: string, partnerId: string): Promise<boolean>;
}
