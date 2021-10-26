import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectMapper } from '@automapper/nestjs';
import type { Mapper } from '@automapper/types';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

import { UserRepository } from '@Repositories/user.repository';
import { UserEntity } from '@Entities/user.entity';

import { User } from '@Responses/user';

import { RegisterRequest, LoginRequest } from './dtos/requests.dto';

import {
  RequestResetPasswordResponse,
  ActivateAccountResponse,
  UnlockAccountResponse,
  RegisterResponse,
  LoginResponse,
} from './dtos/responses.dto';

import { MailService } from '@Modules/mail/mail.service';

@Injectable()
export class AccountService {
  constructor(
    @InjectMapper() private readonly mapper: Mapper,
    private userRepository: UserRepository,
    private configService: ConfigService,
    private mailService: MailService,
    private jwtService: JwtService,
  ) {}

  private signToken(type: string, _user: UserEntity): string {
    const secret = this.configService.get('secret.jwt');

    const payload = {
      userId: _user.id,
      userEmai: _user.email,
      userFirstName: _user.firstName,
    };

    switch (type) {
      case 'Access Token': {
        const options = {
          secret: secret,
          expiresIn: '2d',
        };

        return this.jwtService.sign(payload, options);
      }
      case 'Refresh Token': {
        const options = {
          secret: secret,
          expiresIn: '30d',
        };

        return this.jwtService.sign(payload, options);
      }
      default:
        throw Error('Undefined token');
    }
  }

  private encrypt(_user: UserEntity, purpose: string): string {
    const activateSecert = this.configService.get<string>('secret.activateSecert');
    const ivString = this.configService.get<string>('secret.iv');
    const bufferSecret = Buffer.from(activateSecert, 'utf8');
    const bufferIV = Buffer.from(ivString, 'utf8');
    const cipher = crypto.createCipheriv('aes-256-cbc', bufferSecret, bufferIV);

    switch (purpose) {
      case 'Activate': {
        const data = {
          userId: _user.id,
          userEmai: _user.email,
          activateCode: _user.activateCode,
        };
        let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'base64');
        encrypted += cipher.final('base64');
        return Buffer.from(encrypted, 'base64').toString('hex');
      }
      case 'Unlock':
      case 'ResetPassword': {
        const data = {
          userId: _user.id,
          userEmai: _user.email,
          resetCode: _user.resetCode,
        };
        let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'base64');
        encrypted += cipher.final('base64');
        return Buffer.from(encrypted, 'base64').toString('hex');
      }
      default:
        throw Error('Undefined token');
    }
  }

  private decrypt(encryptedString: string): string {
    const realEncrypeted = Buffer.from(encryptedString, 'hex');

    const activateSecert = this.configService.get<string>('secret.activateSecert');
    const ivString = this.configService.get<string>('secret.iv');
    const bufferSecret = Buffer.from(activateSecert, 'utf8');
    const bufferIV = Buffer.from(ivString, 'utf8');
    const decipher = crypto.createDecipheriv('aes-256-cbc', bufferSecret, bufferIV);

    let decryptedData = decipher.update(realEncrypeted, 'base64', 'utf8');
    decryptedData += decipher.final('utf8');
    return decryptedData;
  }

  async register(request: RegisterRequest): Promise<RegisterResponse> {
    const emailExists = await this.userRepository.checkEmailExists(request.email);

    if (emailExists != true) {
      throw new HttpException('This email has been used', HttpStatus.CONFLICT);
    }

    const saltRounds = this.configService.get<number>('bscryptSlatRounds');
    const hashPassword = await bcrypt.hash(request.password, saltRounds);

    const _user = new UserEntity();
    _user.email = request.email;
    _user.password = hashPassword;
    _user.firstName = request.firstName;
    _user.lastName = request.lastName;
    _user.isActivated = false;
    _user.activateCode = Math.random().toString(36).slice(-10);
    _user.loginFailedStrike = 0;
    _user.isLock = false;
    _user.lastLogin = new Date();
    await this.userRepository.save(_user);

    // Encrypt token
    const encryptedToken = this.encrypt(_user, 'Activate');

    // Send mail
    await this.mailService.sendAccountActivationMail(_user, encryptedToken);

    return {
      user: this.mapper.map(_user, User, UserEntity),
      accessToken: this.signToken('Access Token', _user),
      refreshToken: this.signToken('Refresh Token', _user),
    };
  }

  async login(request: LoginRequest): Promise<LoginResponse> {
    const _user = await this.userRepository.findOne({ email: request.email });

    if (!_user) {
      throw new HttpException('No account', HttpStatus.NOT_FOUND);
    }

    if (!(await bcrypt.compare(request.password, _user.password))) {
      _user.loginFailedStrike++;

      if (_user.loginFailedStrike == 3) {
        _user.isLock = true;
        _user.resetCode = Math.random().toString(36).slice(-10);
        // Encrypt token
        const encryptedToken = this.encrypt(_user, 'Unlock');
        // Send mail
        await this.mailService.sendAccountUnlockMail(_user, encryptedToken);
      }

      await this.userRepository.save(_user);

      if (_user.loginFailedStrike >= 3) {
        const message = 'Account has been locked, check email for more instruction';
        throw new HttpException(message, HttpStatus.FORBIDDEN);
      }

      throw new HttpException('Wrong password', HttpStatus.UNAUTHORIZED);
    }

    if (_user.loginFailedStrike >= 3) {
      const message = 'Account has been locked, check email for more instruction';
      throw new HttpException(message, HttpStatus.FORBIDDEN);
    }

    _user.loginFailedStrike = 0;
    _user.lastLogin = new Date();

    await this.userRepository.save(_user);

    return {
      user: this.mapper.map(_user, User, UserEntity),
      accessToken: this.signToken('Access Token', _user),
      refreshToken: this.signToken('Refresh Token', _user),
    };
  }

  async activate(encryptedString: string): Promise<ActivateAccountResponse> {
    const decryptedData = this.decrypt(encryptedString);
    const data: { userId: string; activateCode: string } = JSON.parse(decryptedData);
    const _user = await this.userRepository.findOne(data.userId);

    if (!_user) {
      throw new HttpException('No user', HttpStatus.NOT_FOUND);
    }

    if (_user.activateCode == data.activateCode && !_user.isActivated) {
      _user.isActivated = true;
      _user.activateDate = new Date();
      await this.userRepository.save(_user);
    } else if (_user.isActivated) {
      throw new HttpException('Account has been activated', HttpStatus.BAD_REQUEST);
    } else {
      throw new HttpException('Wrong activate code', HttpStatus.FORBIDDEN);
    }

    return {
      user: this.mapper.map(_user, User, UserEntity),
      accessToken: this.signToken('Access Token', _user),
      refreshToken: this.signToken('Refresh Token', _user),
    };
  }

  async unlock(encryptedString: string): Promise<UnlockAccountResponse> {
    const decryptedData = this.decrypt(encryptedString);
    const data: { userId: string; resetCode: string } = JSON.parse(decryptedData);
    const _user = await this.userRepository.findOne(data.userId);

    if (!_user) {
      throw new HttpException('No account', HttpStatus.NOT_FOUND);
    }

    if (_user.isLock && _user.resetCode == data.resetCode) {
      _user.isLock = false;
      _user.resetCode = Math.random().toString(36).slice(-10);
      _user.loginFailedStrike = 0;
      await this.userRepository.save(_user);
    } else if (!_user.isLock) {
      throw new HttpException('Account has been unlocked', HttpStatus.BAD_REQUEST);
    } else {
      throw new HttpException('Wrong unlock code', HttpStatus.FORBIDDEN);
    }

    return {
      user: this.mapper.map(_user, User, UserEntity),
      accessToken: this.signToken('Access Token', _user),
      refreshToken: this.signToken('Refresh Token', _user),
    };
  }

  async requestResetPassword(email: string): Promise<RequestResetPasswordResponse> {
    const _user = await this.userRepository.findOne({ email: email });

    if (!_user) {
      throw new HttpException('No user', HttpStatus.NOT_FOUND);
    }

    // Encrypt data
    const encryptedToken = this.encrypt(_user, 'ResetPassword');
    // Send mail
    await this.mailService.sendAccountRequestResetPasswordMail(_user, encryptedToken);

    return {
      status: true,
    };
  }
}
