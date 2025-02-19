import { PipeTransform } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { ZodSchema } from 'zod';

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown) {
    try {
      const parsedValue = this.schema.parse(value);
      return parsedValue;
    } catch (error: any) {
      console.error(error);
      throw new RpcException({
        message: `Validation failed: ${error.message}`,
        validationErrors: error.errors,
      });
    }
  }
}
