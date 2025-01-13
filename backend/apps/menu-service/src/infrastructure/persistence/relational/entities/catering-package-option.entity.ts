import { EntityRelationalHelper } from '@app/common';
import { NullableType } from '@app/common/types/common';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { CateringPackageEntity } from './catering-package.entity';

@Entity({ name: 'catering_package_options' })
export class CateringPackageOptionEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'text', unique: true })
  name: string;

  @ManyToMany(() => CateringPackageEntity, packageEntity => packageEntity.options)
  packages: CateringPackageEntity[];

  @Column({ type: 'varchar' })
  status: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', nullable: true })
  updatedAt: NullableType<Date>;
}
