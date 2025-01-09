import { EntityRelationalHelper } from '@app/common';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { CateringPackageOptionEntity } from './catering-package-option.entity';

@Entity({ name: 'catering_packages' })
export class CateringPackageEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'text', name: 'name' })
  name: string;

  @Column({ type: 'boolean', default: true, name: 'is_active' })
  isActive: boolean;

  @OneToMany(() => CateringPackageOptionEntity, option => option.package, {
    cascade: true,
  })
  options: CateringPackageOptionEntity[];
}
