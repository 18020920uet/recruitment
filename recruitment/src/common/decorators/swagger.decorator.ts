import { ApiProperty } from '@nestjs/swagger';
import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';

export const ApplicationApiOkResponse = <TModel extends Type<any>>(model: TModel) => {
  return applyDecorators(
    ApiExtraModels(model),
    ApiOkResponse({
      description: 'Success',
      content: {
        'application-json': {
          schema: {
            properties: {
              code: { type: 'number', default: 1 },
              statusCode : { type: 'number'},
              message: { type: 'string' },
              data: {
                $ref: getSchemaPath(model)
              }
            },
          },
        },
      },
    }),
  );
};
