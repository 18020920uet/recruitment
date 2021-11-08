import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, ApiCreatedResponse, getSchemaPath } from '@nestjs/swagger';

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
              statusCode: { type: 'number' },
              message: { type: 'string' },
              data: { $ref: getSchemaPath(model) },
            },
          },
        },
      },
    }),
  );
};

export const ApplicationArrayApiOkResponse = <TModel extends Type<any>>(model: TModel) => {
  return applyDecorators(
    ApiExtraModels(model),
    ApiOkResponse({
      description: 'Success',
      content: {
        'application-json': {
          schema: {
            properties: {
              code: { type: 'number', default: 1 },
              statusCode: { type: 'number' },
              message: { type: 'string' },
              data: {
                type: 'array',
                items: { $ref: getSchemaPath(model) }
              },
            },
          },
        },
      },
    }),
  );
};

export const ApplicationApiCreateResponse = <TModel extends Type<any>>(model: TModel) => {
  return applyDecorators(
    ApiExtraModels(model),
    ApiCreatedResponse({
      description: 'Success',
      content: {
        'application-json': {
          schema: {
            properties: {
              code: { type: 'number', default: 1 },
              statusCode: { type: 'number', default: 201 },
              message: { type: 'string' },
              data: { $ref: getSchemaPath(model) },
            },
          },
        },
      },
    }),
  );
};
