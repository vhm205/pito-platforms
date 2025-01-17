import { DishQuantityUnit } from '@app/common/enums/dish';
import { NullableType } from '@app/common/types/common';
import {
  DataSource,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity({ name: 'stores' })
export class StoreEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'partner_id', type: 'uuid', nullable: true })
  partnerId: NullableType<string>;

  @ManyToOne(() => PartnerEntity)
  @JoinColumn({ name: 'partner_id' })
  partner?: PartnerEntity;
}

@Entity({ name: 'partners' })
export class PartnerEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'business_name', type: 'text', nullable: true })
  businessName: string;

  @Column({ name: 'is_active', type: 'boolean', default: false })
  isActive: boolean;
}

@Entity({ name: 'items' })
export class ItemEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'options_choices', type: 'jsonb', nullable: true })
  optionsChoices: NullableType<any>;

  @Column({ name: 'store_id', type: 'uuid', nullable: true })
  storeId: string;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @ManyToOne(() => StoreEntity)
  @JoinColumn({ name: 'store_id' })
  store: StoreEntity;
}

@Entity({ name: 'dishes' })
export class DishEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;

  @Column({ type: 'text', nullable: true })
  name: string;

  @Column({ type: 'integer', nullable: true })
  quantity: number;

  @Column({
    name: 'quantity_unit',
    type: 'enum',
    enum: DishQuantityUnit,
    nullable: true,
  })
  quantityUnit?: NullableType<DishQuantityUnit>;

  @Column({ type: 'text', array: true, default: '{}' })
  images: string[];

  @Column({ name: 'store_id', type: 'uuid', nullable: true })
  storeId: NullableType<string>;

  @Column({ name: 'partner_id', type: 'uuid', nullable: true })
  partnerId: NullableType<string>;

  @Column({ name: 'package_option_id', type: 'integer', nullable: true })
  packageOptionId?: NullableType<number>;
}

const BATCH_SIZE = 100;

async function syncData(partnerDataSource: DataSource, _customerDataSource: DataSource) {
  const queryRunner = partnerDataSource.createQueryRunner();
  await queryRunner.startTransaction();

  try {
    const { entities: items, raw } = await partnerDataSource
      .createQueryBuilder(ItemEntity, 'item')
      .leftJoinAndSelect(StoreEntity, 'store', 'item.storeId = store.id')
      .select(['item.id', 'item.storeId', 'item.optionsChoices', 'store.id', 'store.partnerId'])
      // .where('item.isActive = true')
      .where('item.optionsChoices IS NOT NULL')
      .getRawAndEntities();

    console.log({ ITEMS_TOTAL: items.length, BATCH_SIZE });

    if (items.length === 0) {
      console.warn('No items found');
      return;
    }

    const dishesToInsert: any[] = [];
    let count = 0;

    console.time('Total time');
    for (const item of items) {
      const rawItem = raw.find(rawItem => rawItem.item_id === item.id);
      const optionsAndChoices = item.optionsChoices;
      const partnerId = rawItem.store_partner_id;

      if (!optionsAndChoices || !Array.isArray(optionsAndChoices)) {
        continue;
      }

      for (const option of optionsAndChoices) {
        if (!option.choices || !Array.isArray(option.choices)) {
          continue;
        }

        for (const choice of option.choices) {
          dishesToInsert[dishesToInsert.length] = {
            choice,
            storeId: item.storeId,
            partnerId,
          };
          count++;

          if (dishesToInsert.length === BATCH_SIZE) {
            await processData(dishesToInsert, partnerDataSource);
            dishesToInsert.length = 0; // Clear the batch
          }
        }
      }
    }

    console.log({ CHOICES_TOTAL: count, CHOICES_REMAINING: dishesToInsert.length });

    // Insert any remaining dishes
    if (dishesToInsert.length > 0) {
      await processData(dishesToInsert, partnerDataSource);
    }

    console.timeEnd('Total time');

    await queryRunner.commitTransaction();

    console.log('Syncing data completed!');
  } catch (error) {
    await queryRunner.rollbackTransaction();
    console.error('Error syncing data:', error);
  } finally {
    await queryRunner.release();
    console.log('Releasing query runner...');
  }
}

async function processData(batch: any[], dataSource: DataSource) {
  await dataSource.transaction(async manager => {
    const dishes: any[] = [];

    console.time('Batch insert dishes');
    for (const { choice, storeId, partnerId } of batch) {
      const dish = new DishEntity();

      dish.id = choice.id;
      dish.name = choice.name;
      dish.quantity = 1;
      dish.quantityUnit = null;
      dish.images = [];
      dish.storeId = storeId;
      dish.partnerId = partnerId;
      dish.packageOptionId = null;

      dishes[dishes.length] = dish;
    }

    await manager
      .createQueryBuilder()
      .insert()
      .into(DishEntity)
      .values(dishes)
      .orIgnore()
      .execute();

    console.timeEnd('Batch insert dishes');
  });
}

// Database Initialization
(async () => {
  const {
    PARTNER_DB_HOST,
    PARTNER_DB_PORT,
    PARTNER_DB_USER,
    PARTNER_DB_PASSWORD,
    PARTNER_DB_NAME,

    DATABASE_HOST,
    DATABASE_PORT,
    DATABASE_PASSWORD,
    DATABASE_USERNAME,
    DATABASE_NAME,
  } = process.env;

  const partnerDataSource = new DataSource({
    type: 'postgres',
    host: PARTNER_DB_HOST,
    port: +PARTNER_DB_PORT!,
    username: PARTNER_DB_USER,
    password: PARTNER_DB_PASSWORD,
    database: PARTNER_DB_NAME,
    entities: [DishEntity, ItemEntity, PartnerEntity, StoreEntity],
    synchronize: false,
  });

  const customerDataSource = new DataSource({
    type: 'postgres',
    host: DATABASE_HOST,
    port: +DATABASE_PORT!,
    username: DATABASE_USERNAME,
    password: DATABASE_PASSWORD,
    database: DATABASE_NAME,
    entities: [ItemEntity, PartnerEntity, StoreEntity],
    synchronize: false,
  });

  try {
    await Promise.all([partnerDataSource.initialize(), customerDataSource.initialize()]);
    console.log('Database connected!');

    await syncData(partnerDataSource, customerDataSource);
  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    await Promise.all([partnerDataSource.destroy(), customerDataSource.destroy()]);
    console.log('Closing database connection...');
  }
})();
