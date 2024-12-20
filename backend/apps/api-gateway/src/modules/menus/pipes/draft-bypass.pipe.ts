import { ItemStatus } from '@app/common/enums/item';
import { PipeTransform, BadRequestException } from '@nestjs/common';
import { ZodSchema } from 'zod';

export class DraftBypassPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown) {
    if (value && typeof value === 'object' && (value as any).status === ItemStatus.DRAFT) {
      return value;
    }

    try {
      const parsedValue = this.schema.parse(value);
      return parsedValue;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('error', error);
      throw new BadRequestException('Validation failed');
    }
  }
}
