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
exports.AccountService = void 0;
const common_1 = require("@nestjs/common");
const nestjs_1 = require("@automapper/nestjs");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const user_repository_1 = require("../../repositories/user.repository");
const user_entity_1 = require("../../entities/user.entity");
const user_1 = require("../../common/responses/user");
let AccountService = class AccountService {
    constructor(mapper, userRepository, configService, jwtService) {
        this.mapper = mapper;
        this.userRepository = userRepository;
        this.configService = configService;
        this.jwtService = jwtService;
    }
    async register(request) {
        const emailExists = await this.userRepository.checkEmailExists(request.email);
        if (emailExists != true) {
            throw new common_1.HttpException('This email has been used', common_1.HttpStatus.CONFLICT);
        }
        const saltRounds = this.configService.get('bscryptSlatRounds');
        const hashPassword = await bcrypt.hash(request.password, saltRounds);
        const _user = new user_entity_1.UserEntity();
        _user.email = request.email;
        _user.password = hashPassword;
        _user.firstName = request.firstName;
        _user.lastName = request.lastName;
        _user.isActivated = false;
        _user.activateCode = Math.random().toString(36).slice(-10);
        _user.loginFailedStrike = 0;
        _user.isLock = false;
        _user.lastLogin = new Date();
        _user.iv = crypto.randomBytes(16).toString('hex');
        await this.userRepository.save(_user);
        const encryptedString = this.encrypt(_user);
        const host = this.configService.get('host');
        const activateURL = `${host}/account/activate?token=${encryptedString}`;
        return {
            user: this.mapper.map(_user, user_1.User, user_entity_1.UserEntity),
            accessToken: this.signToken('Access Token', _user),
            refreshToken: this.signToken('Refresh Token', _user),
        };
    }
    async login(request) {
        const _user = await this.userRepository.findOne({ email: request.email });
        if (!_user) {
            throw new common_1.HttpException("Can't find user with email", common_1.HttpStatus.NOT_FOUND);
        }
        if (!(await bcrypt.compare(request.password, _user.password))) {
            _user.loginFailedStrike++;
            if (_user.loginFailedStrike == 3) {
                _user.isLock = true;
                _user.resetCode = Math.random().toString(36).slice(-10);
            }
            await this.userRepository.save(_user);
            if (_user.loginFailedStrike >= 3) {
                const message = 'Account has been locked, check email for more instruction';
                throw new common_1.HttpException(message, common_1.HttpStatus.FORBIDDEN);
            }
            throw new common_1.HttpException('Wrong password', common_1.HttpStatus.UNAUTHORIZED);
        }
        if (_user.loginFailedStrike >= 3) {
            const message = 'Account has been locked, check email for more instruction';
            throw new common_1.HttpException(message, common_1.HttpStatus.FORBIDDEN);
        }
        _user.loginFailedStrike = 0;
        _user.lastLogin = new Date();
        this.userRepository.save(_user);
        return {
            user: this.mapper.map(_user, user_1.User, user_entity_1.UserEntity),
            accessToken: this.signToken('Access Token', _user),
            refreshToken: this.signToken('Refresh Token', _user),
        };
    }
    async activate(encryptedString) {
        const decryptedData = this.decrypt(encryptedString);
        const data = JSON.parse(decryptedData);
        const _user = await this.userRepository.findOne(data.userId);
        if (!_user) {
            throw new common_1.HttpException("Can't find user", common_1.HttpStatus.NOT_FOUND);
        }
        if (_user.activateCode == data.activateCode) {
            if (!_user.isActivated) {
                _user.isActivated = true;
                _user.activateDate = new Date();
                await this.userRepository.save(_user);
            }
            else {
                _user.activateCode = Math.random().toString(36).slice(-10);
                await this.userRepository.save(_user);
                throw new common_1.HttpException('Account were activated before', common_1.HttpStatus.NOT_ACCEPTABLE);
            }
        }
        else {
            throw new common_1.HttpException('Wrong activate code', common_1.HttpStatus.FORBIDDEN);
        }
        return {
            user: this.mapper.map(_user, user_1.User, user_entity_1.UserEntity),
            accessToken: this.signToken('Access Token', _user),
            refreshToken: this.signToken('Refresh Token', _user),
        };
    }
    signToken(type, _user) {
        switch (type) {
            case 'Access Token': {
                return this.jwtService.sign({
                    userId: _user.id,
                    userEmai: _user.email,
                    userFirstName: _user.firstName,
                }, {
                    secret: this.configService.get('secret.jwt.accessSecert'),
                    expiresIn: '2d',
                });
            }
            case 'Refresh Token': {
                return this.jwtService.sign({
                    userId: _user.id,
                    userEmai: _user.email,
                    userFirstName: _user.firstName,
                }, {
                    secret: this.configService.get('secret.jwt.refreshSecert'),
                    expiresIn: '30d',
                });
            }
            default:
                throw Error('Undefined token');
        }
    }
    encrypt(_user) {
        const activateSecert = this.configService.get('secret.activateSecert');
        const ivString = this.configService.get('secret.iv');
        const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(activateSecert, 'utf8'), Buffer.from(ivString, 'utf8'));
        const data = {
            userId: _user.id,
            userEmai: _user.email,
            activateCode: _user.activateCode,
        };
        let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'base64');
        encrypted += cipher.final('base64');
        return Buffer.from(encrypted, 'base64').toString('hex');
    }
    decrypt(encryptedString) {
        const realEncrypeted = Buffer.from(encryptedString, 'hex');
        const activateSecert = this.configService.get('secret.activateSecert');
        const ivString = this.configService.get('secret.iv');
        const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(activateSecert, 'utf8'), Buffer.from(ivString, 'utf8'));
        let decryptedData = decipher.update(realEncrypeted, 'base64', 'utf8');
        decryptedData += decipher.final('utf8');
        return decryptedData;
    }
};
AccountService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, nestjs_1.InjectMapper)()),
    __metadata("design:paramtypes", [Object, user_repository_1.UserRepository,
        config_1.ConfigService,
        jwt_1.JwtService])
], AccountService);
exports.AccountService = AccountService;
//# sourceMappingURL=account.service.js.map