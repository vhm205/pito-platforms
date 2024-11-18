import type { Type } from '@nestjs/common';
import { applyDecorators } from '@nestjs/common';
import type { ApiResponseOptions } from '@nestjs/swagger';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';

import { StandardResponseWrapper } from '../gateway-common/dto/standard-response.dto';

export function ApiWrapperResponse<T extends Type>(options: {
  type: T;
  description?: string;
}): MethodDecorator {
  return applyDecorators(
    ApiExtraModels(StandardResponseWrapper),
    ApiExtraModels(options.type),
    ApiOkResponse({
      description: options.description,
      schema: {
        allOf: [
          { $ref: getSchemaPath(StandardResponseWrapper) },
          {
            properties: {
              data: { $ref: getSchemaPath(options.type) },
            },
          },
        ],
      },
    } as ApiResponseOptions),
  );
}
