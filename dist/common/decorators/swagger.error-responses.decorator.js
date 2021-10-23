"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotAcceptableResponse = exports.UnauthorizedResponse = exports.ForbiddenResponse = exports.InternalServerErrorResponse = exports.NotFoundResponse = exports.ConflictResponse = void 0;
const swagger_1 = require("@nestjs/swagger");
class ErrorResponse {
    constructor() {
        this.status = 0;
    }
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ErrorResponse.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ErrorResponse.prototype, "message", void 0);
class ConflictResponse extends ErrorResponse {
    constructor() {
        super(...arguments);
        this.statusCode = 409;
    }
}
__decorate([
    (0, swagger_1.ApiProperty)({ default: 409 }),
    __metadata("design:type", Number)
], ConflictResponse.prototype, "statusCode", void 0);
exports.ConflictResponse = ConflictResponse;
class NotFoundResponse extends ErrorResponse {
    constructor() {
        super(...arguments);
        this.statusCode = 404;
    }
}
__decorate([
    (0, swagger_1.ApiProperty)({ default: 404 }),
    __metadata("design:type", Number)
], NotFoundResponse.prototype, "statusCode", void 0);
exports.NotFoundResponse = NotFoundResponse;
class InternalServerErrorResponse extends ErrorResponse {
    constructor() {
        super(...arguments);
        this.statusCode = 500;
    }
}
__decorate([
    (0, swagger_1.ApiProperty)({ default: 500 }),
    __metadata("design:type", Number)
], InternalServerErrorResponse.prototype, "statusCode", void 0);
exports.InternalServerErrorResponse = InternalServerErrorResponse;
class ForbiddenResponse extends ErrorResponse {
    constructor() {
        super(...arguments);
        this.statusCode = 403;
    }
}
__decorate([
    (0, swagger_1.ApiProperty)({ default: 403 }),
    __metadata("design:type", Number)
], ForbiddenResponse.prototype, "statusCode", void 0);
exports.ForbiddenResponse = ForbiddenResponse;
class UnauthorizedResponse extends ErrorResponse {
    constructor() {
        super(...arguments);
        this.statusCode = 401;
    }
}
__decorate([
    (0, swagger_1.ApiProperty)({ default: 401 }),
    __metadata("design:type", Number)
], UnauthorizedResponse.prototype, "statusCode", void 0);
exports.UnauthorizedResponse = UnauthorizedResponse;
class NotAcceptableResponse extends ErrorResponse {
    constructor() {
        super(...arguments);
        this.statusCode = 500;
    }
}
__decorate([
    (0, swagger_1.ApiProperty)({ default: 406 }),
    __metadata("design:type", Number)
], NotAcceptableResponse.prototype, "statusCode", void 0);
exports.NotAcceptableResponse = NotAcceptableResponse;
//# sourceMappingURL=swagger.error-responses.decorator.js.map