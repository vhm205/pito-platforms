import { EntityRelationalHelper } from '@app/common';
import { NullableType } from '@app/common/types/common';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { CateringPackageEntity } from './catering-package.entity';

@Entity({ name: 'catering_package_options' })
export class CateringPackageOptionEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'text' })
  name: string;

  @Column({ name: 'package_id' })
  packageId: number;

  @ManyToOne(() => CateringPackageEntity, cateringPackage => cateringPackage.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'package_id' })
  package: CateringPackageEntity;

  @Column({ type: 'varchar' })
  status: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', nullable: true })
  updatedAt: NullableType<Date>;
}
