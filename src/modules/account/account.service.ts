import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { getManager } from 'typeorm';
import { InjectMapper } from '@automapper/nestjs';
import type { Mapper } from '@automapper/types';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

import { AuthenticationService } from '@Modules/authentication/authentication.service';
import { EncryptService } from '@Shared/services/encrypt.service';
import { FileService } from '@Shared/services/file.service';

import { UserRepository } from '@Repositories/user.repository';
import { UserEntity } from '@Entities/user.entity';
import { CurriculumVitaeEntity } from '@Entities/curriculum-vitae.entity';

import { RegisterRequest, LoginRequest } from './dtos/requests';
import { User } from '@Shared/responses/user';

import { RequestResetPasswordResponse, AccountResponse } from './dtos/responses';

import { MailService } from '@Modules/mail/mail.service';

@Injectable()
export class AccountService {
  constructor(
    @InjectMapper() private readonly mapper: Mapper,
    private authenticationService: AuthenticationService,
    private userRepository: UserRepository,
    private encryptService: EncryptService,
    private configService: ConfigService,
    private fileService: FileService,
    private mailService: MailService,
  ) {}

  private async getAccountResponse(_user: UserEntity): Promise<AccountResponse> {
    _user.avatar = this.fileService.getAvatar(_user);
    const response: AccountResponse = {
      user: this.mapper.map(_user, User, UserEntity),
      accessToken: await this.authenticationService.generateAccessToken(_user),
      refreshToken: await this.authenticationService.generateRefreshToken(_user),
    };
    return response;
  }

  async register(request: RegisterRequest): Promise<AccountResponse> {
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

    const _cv = new CurriculumVitaeEntity();
    _cv.user = _user;

    await getManager().transaction(async (transactionalEntityManager) => {
      await transactionalEntityManager.save(_user);
      await transactionalEntityManager.save(_cv);
      // Encrypt token
      const encryptedToken = this.encryptService.encryptActivateToken(_user);
      // Send mail
      await this.mailService.sendAccountActivationMail(_user, encryptedToken);
    });

    return await this.getAccountResponse(_user);
  }

  async login(request: LoginRequest): Promise<AccountResponse> {
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
        const encryptedToken = this.encryptService.encryptUnlockOrResetPasswordToken(_user);

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

    return await this.getAccountResponse(_user);
  }

  async activate(encryptedString: string): Promise<AccountResponse> {
    const decryptedData = this.encryptService.decryptToken(encryptedString);
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
      throw new HttpException('Account has been activated', HttpStatus.NOT_ACCEPTABLE);
    } else {
      throw new HttpException('Wrong activate code', HttpStatus.FORBIDDEN);
    }

    return await this.getAccountResponse(_user);
  }

  async unlock(encryptedString: string): Promise<AccountResponse> {
    const decryptedData = this.encryptService.decryptToken(encryptedString);
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
      throw new HttpException('Account has been unlocked', HttpStatus.NOT_ACCEPTABLE);
    } else {
      throw new HttpException('Wrong unlock code', HttpStatus.FORBIDDEN);
    }

    return await this.getAccountResponse(_user);
  }

  async requestResetPassword(email: string): Promise<RequestResetPasswordResponse> {
    const _user = await this.userRepository.findOne({ email: email });

    if (!_user) {
      throw new HttpException('No user', HttpStatus.NOT_FOUND);
    }

    // Encrypt data
    const encryptedToken = this.encryptService.encryptUnlockOrResetPasswordToken(_user);
    // Send mail
    await this.mailService.sendAccountRequestResetPasswordMail(_user, encryptedToken);

    return {
      status: true,
    };
  }
}
