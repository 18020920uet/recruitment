"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationApiOkResponse = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const ApplicationApiOkResponse = (model) => {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiExtraModels)(model), (0, swagger_1.ApiOkResponse)({
        description: 'Success',
        content: {
            'application-json': {
                schema: {
                    properties: {
                        code: { type: 'number', default: 1 },
                        statusCode: { type: 'number' },
                        message: { type: 'string' },
                        data: {
                            $ref: (0, swagger_1.getSchemaPath)(model),
                        },
                    },
                },
            },
        },
    }));
};
exports.ApplicationApiOkResponse = ApplicationApiOkResponse;
//# sourceMappingURL=swagger.decorator.js.map