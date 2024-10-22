import { PrimaryGeneratedColumn } from 'typeorm';

import type { AbstractDto } from './dto/abstract.dto';

export abstract class AbstractEntity<DTO extends AbstractDto = AbstractDto, O = never> {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  // @CreateDateColumn({
  //   type: 'timestamp',
  // })
  // createdAt!: Date;

  // @UpdateDateColumn({
  //   type: 'timestamp',
  // })
  // updatedAt!: Date;

  toDto(options?: O): DTO {
    const dtoClass = this.constructor.prototype.dtoClass;

    if (!dtoClass) {
      throw new Error(
        `You need to use @UseDto on class (${
          this.constructor.name
        }) be able to call toDto function`,
      );
    }

    return new dtoClass(this, options);
  }
}
