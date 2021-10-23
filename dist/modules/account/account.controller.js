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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const swagger_decorator_1 = require("../../common/decorators/swagger.decorator");
const swagger_error_responses_decorator_1 = require("../../common/decorators/swagger.error-responses.decorator");
const account_service_1 = require("./account.service");
const requests_dto_1 = require("./dtos/requests.dto");
const responses_dto_1 = require("./dtos/responses.dto");
let AccountController = class AccountController {
    constructor(accountService) {
        this.accountService = accountService;
    }
    async register(registerRequest) {
        return await this.accountService.register(registerRequest);
    }
    async login(loginRequest) {
        return await this.accountService.login(loginRequest);
    }
    async activate(encryptedString) {
        return await this.accountService.activate(encryptedString);
    }
    async resetPassword(email) {
    }
    async unlock(unlockToken) {
    }
};
__decorate([
    (0, common_1.Post)('register'),
    (0, swagger_1.ApiOperation)({ summary: 'Register' }),
    (0, swagger_decorator_1.ApplicationApiOkResponse)(responses_dto_1.RegisterResponse),
    (0, swagger_1.ApiConflictResponse)({
        description: 'Email has already been used',
        type: swagger_error_responses_decorator_1.ConflictResponse,
    }),
    (0, swagger_1.ApiInternalServerErrorResponse)({
        description: 'Server error',
        type: swagger_error_responses_decorator_1.InternalServerErrorResponse,
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [requests_dto_1.RegisterRequest]),
    __metadata("design:returntype", Promise)
], AccountController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('login'),
    (0, swagger_1.ApiOperation)({ summary: 'Login' }),
    (0, swagger_decorator_1.ApplicationApiOkResponse)(responses_dto_1.LoginResponse),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'No account', type: swagger_error_responses_decorator_1.NotFoundResponse }),
    (0, swagger_1.ApiUnauthorizedResponse)({
        description: 'Wrong password',
        type: swagger_error_responses_decorator_1.UnauthorizedResponse,
    }),
    (0, swagger_1.ApiForbiddenResponse)({
        description: 'Account locked',
        type: swagger_error_responses_decorator_1.ForbiddenResponse,
    }),
    (0, swagger_1.ApiInternalServerErrorResponse)({
        description: 'Server error',
        type: swagger_error_responses_decorator_1.InternalServerErrorResponse,
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [requests_dto_1.LoginRequest]),
    __metadata("design:returntype", Promise)
], AccountController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('activate'),
    (0, swagger_1.ApiOperation)({ summary: 'Activate account' }),
    (0, swagger_decorator_1.ApplicationApiOkResponse)(responses_dto_1.ActivateAccountResponse),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'No account', type: swagger_error_responses_decorator_1.NotFoundResponse }),
    (0, swagger_1.ApiForbiddenResponse)({
        description: 'Wrong activate code',
        type: swagger_error_responses_decorator_1.ForbiddenResponse,
    }),
    (0, swagger_1.ApiInternalServerErrorResponse)({
        description: 'Server error',
        type: swagger_error_responses_decorator_1.InternalServerErrorResponse,
    }),
    (0, swagger_1.ApiNotAcceptableResponse)({
        description: 'Account had been activated before',
        type: swagger_error_responses_decorator_1.NotAcceptableResponse,
    }),
    __param(0, (0, common_1.Query)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AccountController.prototype, "activate", null);
__decorate([
    (0, common_1.Put)('request-reset-password'),
    (0, swagger_1.ApiOperation)({ summary: 'Request for reset password' }),
    __param(0, (0, common_1.Query)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AccountController.prototype, "resetPassword", null);
__decorate([
    (0, common_1.Post)('unlock'),
    (0, swagger_1.ApiOperation)({ summary: 'Unlock account' }),
    __param(0, (0, common_1.Query)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AccountController.prototype, "unlock", null);
AccountController = __decorate([
    (0, common_1.Controller)('account'),
    __metadata("design:paramtypes", [account_service_1.AccountService])
], AccountController);
exports.AccountController = AccountController;
//# sourceMappingURL=account.controller.js.map