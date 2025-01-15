import { EntityRelationalHelper } from '@app/common';
import { NullableType } from '@app/common/types/common';
import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { CateringPackageOptionEntity } from './catering-package-option.entity';

@Entity({ name: 'catering_packages' })
export class CateringPackageEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'text', name: 'name', unique: true })
  name: string;

  @Column({ type: 'boolean', default: true, name: 'is_active' })
  isActive: boolean;

  @ManyToMany(() => CateringPackageOptionEntity, option => option.packages, {
    cascade: true,
  })
  @JoinTable({
    name: 'packages_options',
    joinColumn: { name: 'package_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'option_id', referencedColumnName: 'id' },
  })
  options: CateringPackageOptionEntity[];

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: NullableType<Date>;
}
