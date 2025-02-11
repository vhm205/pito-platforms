import { Entity, PrimaryColumn } from 'typeorm';

@Entity('store_favorites')
export class StoreFavoriteEntity {
  @PrimaryColumn('uuid', { name: 'user_id' })
  userId: string;

  @PrimaryColumn('uuid', { name: 'store_id' })
  storeId: string;
}
