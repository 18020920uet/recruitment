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
exports.ActivateAccountResponse = exports.LoginResponse = exports.RegisterResponse = void 0;
const swagger_1 = require("@nestjs/swagger");
const user_1 = require("../../../common/responses/user");
class RegisterResponse {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", user_1.User)
], RegisterResponse.prototype, "user", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], RegisterResponse.prototype, "accessToken", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], RegisterResponse.prototype, "refreshToken", void 0);
exports.RegisterResponse = RegisterResponse;
class LoginResponse {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", user_1.User)
], LoginResponse.prototype, "user", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], LoginResponse.prototype, "accessToken", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], LoginResponse.prototype, "refreshToken", void 0);
exports.LoginResponse = LoginResponse;
class ActivateAccountResponse {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", user_1.User)
], ActivateAccountResponse.prototype, "user", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ActivateAccountResponse.prototype, "accessToken", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ActivateAccountResponse.prototype, "refreshToken", void 0);
exports.ActivateAccountResponse = ActivateAccountResponse;
//# sourceMappingURL=responses.dto.js.map