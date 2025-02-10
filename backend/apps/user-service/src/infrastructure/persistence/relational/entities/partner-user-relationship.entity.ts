import { Entity, Column } from 'typeorm';

@Entity('partner_users')
export class PartnerUserRelationship {
  @Column({ name: 'partner_id', type: 'uuid', primary: true })
  partnerId: string;

  @Column({ name: 'user_id', type: 'uuid', primary: true })
  userId: string;
}
