import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectMapper } from '@automapper/nestjs';
import type { Mapper } from '@automapper/types';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { promisify } from 'util';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

import { UserRepository } from '@Repositories/user.repository';
import { UserEntity } from '@Entities/user.entity';

import { User } from '@Responses/user';

import { RegisterRequest, LoginRequest } from './dtos/requests.dto';

import {
  ActivateAccountResponse,
  LoginResponse,
  RegisterResponse,
} from './dtos/responses.dto';

@Injectable()
export class AccountService {
  constructor(
    @InjectMapper() private readonly mapper: Mapper,
    private userRepository: UserRepository,
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  async register(request: RegisterRequest): Promise<RegisterResponse> {
    const emailExists = await this.userRepository.checkEmailExists(
      request.email,
    );

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
    _user.iv = crypto.randomBytes(16).toString('hex');
    await this.userRepository.save(_user);

    const encryptedString = this.encrypt(_user);
    const host = this.configService.get<string>('host');
    const activateURL = `${host}/account/activate?token=${encryptedString}`;

    // Send active url to user emailExists

    return {
      user: this.mapper.map(_user, User, UserEntity),
      accessToken: this.signToken('Access Token', _user),
      refreshToken: this.signToken('Refresh Token', _user),
    };
  }

  async login(request: LoginRequest): Promise<LoginResponse> {
    const _user = await this.userRepository.findOne({ email: request.email });

    if (!_user) {
      throw new HttpException(
        "Can't find user with email",
        HttpStatus.NOT_FOUND,
      );
    }

    if (!(await bcrypt.compare(request.password, _user.password))) {
      _user.loginFailedStrike++;

      if (_user.loginFailedStrike == 3) {
        _user.isLock = true;
        _user.resetCode = Math.random().toString(36).slice(-10);
        // Send mail
      }

      await this.userRepository.save(_user);

      if (_user.loginFailedStrike >= 3) {
        const message =
          'Account has been locked, check email for more instruction';
        throw new HttpException(message, HttpStatus.FORBIDDEN);
      }

      throw new HttpException('Wrong password', HttpStatus.UNAUTHORIZED);
    }

    if (_user.loginFailedStrike >= 3) {
      const message =
        'Account has been locked, check email for more instruction';
      throw new HttpException(message, HttpStatus.FORBIDDEN);
    }

    _user.loginFailedStrike = 0;
    _user.lastLogin = new Date();

    this.userRepository.save(_user);

    return {
      user: this.mapper.map(_user, User, UserEntity),
      accessToken: this.signToken('Access Token', _user),
      refreshToken: this.signToken('Refresh Token', _user),
    };
  }

  async activate(encryptedString: string): Promise<ActivateAccountResponse> {
    const decryptedData = this.decrypt(encryptedString);
    const data: { userId: string; activateCode: string } =
      JSON.parse(decryptedData);

    const _user = await this.userRepository.findOne(data.userId);

    if (!_user) {
      throw new HttpException("Can't find user", HttpStatus.NOT_FOUND);
    }

    if (_user.activateCode == data.activateCode) {
      if (!_user.isActivated) {
        _user.isActivated = true;
        _user.activateDate = new Date();
        await this.userRepository.save(_user);
      } else {
        _user.activateCode = Math.random().toString(36).slice(-10);
        await this.userRepository.save(_user);
        throw new HttpException(
          'Account were activated before',
          HttpStatus.NOT_ACCEPTABLE,
        );
      }
    } else {
      throw new HttpException('Wrong activate code', HttpStatus.FORBIDDEN);
    }

    return {
      user: this.mapper.map(_user, User, UserEntity),
      accessToken: this.signToken('Access Token', _user),
      refreshToken: this.signToken('Refresh Token', _user),
    };
  }

  private signToken(type: string, _user: UserEntity): string {
    switch (type) {
      case 'Access Token': {
        return this.jwtService.sign(
          {
            userId: _user.id,
            userEmai: _user.email,
            userFirstName: _user.firstName,
          },
          {
            secret: this.configService.get('secret.jwt.accessSecert'),
            expiresIn: '2d',
          },
        );
      }
      case 'Refresh Token': {
        return this.jwtService.sign(
          {
            userId: _user.id,
            userEmai: _user.email,
            userFirstName: _user.firstName,
          },
          {
            secret: this.configService.get('secret.jwt.refreshSecert'),
            expiresIn: '30d',
          },
        );
      }
      default:
        throw Error('Undefined token');
    }
  }

  private encrypt(_user: UserEntity): string {
    const activateSecert = this.configService.get<string>(
      'secret.activateSecert',
    );
    const ivString = this.configService.get<string>('secret.iv');

    const cipher = crypto.createCipheriv(
      'aes-256-cbc',
      Buffer.from(activateSecert, 'utf8'),
      Buffer.from(ivString, 'utf8'),
    );

    const data = {
      userId: _user.id,
      userEmai: _user.email,
      activateCode: _user.activateCode,
    };

    let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'base64');
    encrypted += cipher.final('base64');
    return Buffer.from(encrypted, 'base64').toString('hex');
  }

  private decrypt(encryptedString: string): string {
    const realEncrypeted = Buffer.from(encryptedString, 'hex');

    const activateSecert = this.configService.get<string>(
      'secret.activateSecert',
    );
    const ivString = this.configService.get<string>('secret.iv');

    const decipher = crypto.createDecipheriv(
      'aes-256-cbc',
      Buffer.from(activateSecert, 'utf8'),
      Buffer.from(ivString, 'utf8'),
    );

    let decryptedData = decipher.update(realEncrypeted, 'base64', 'utf8');
    decryptedData += decipher.final('utf8');
    return decryptedData;
  }
}
