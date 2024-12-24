import type { Type } from '@nestjs/common';
import { applyDecorators } from '@nestjs/common';
import type { ApiResponseOptions } from '@nestjs/swagger';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';

import { StandardResponseWrapper } from '../gateway-common/dto/standard-response.dto';

export function ApiWrapperResponse<T extends Type>(options: {
  type: T | T[];
  description?: string;
}): MethodDecorator {
  const types = Array.isArray(options.type) ? options.type : [options.type];
  return applyDecorators(
    ApiExtraModels(StandardResponseWrapper),
    ...types.map(type => ApiExtraModels(type)), // Apply ApiExtraModels for each type
    ApiOkResponse({
      description: options.description,
      schema: {
        allOf: [
          { $ref: getSchemaPath(StandardResponseWrapper) },
          {
            properties: {
              data: Array.isArray(options.type)
                ? { type: 'array', items: { $ref: getSchemaPath(options.type[0]) } }
                : { $ref: getSchemaPath(options.type) },
            },
          },
        ],
      },
    } as ApiResponseOptions),
  );
}
