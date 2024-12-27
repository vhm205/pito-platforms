import { ItemStatus } from '@app/common/enums/item';
import { PipeTransform, BadRequestException } from '@nestjs/common';
import { ZodSchema, ZodError } from 'zod';

interface Draftable {
  status?: ItemStatus;
}

export class DraftBypassPipe implements PipeTransform {
  constructor(private schema: ZodSchema<any>) {}

  private isDraftable(value: unknown): value is Draftable {
    return value !== null && typeof value === 'object';
  }

  transform(value: unknown): unknown {
    if (this.isDraftable(value) && value.status === ItemStatus.DRAFT) {
      return value;
    }

    try {
      const parsedValue = this.schema.parse(value);
      return parsedValue;
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.errors
          .map(errorDetail => {
            const fieldPath =
              errorDetail.path.length > 0 ? `Field "${errorDetail.path.join('.')}"` : 'Root object';
            return `${fieldPath} - ${errorDetail.message}`;
          })
          .join('; ');

        throw new BadRequestException(
          `Validation failed: ${formattedErrors}. Please ensure all fields are correctly formatted.`,
        );
      }

      throw error;
    }
  }
}
