import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UserRepository } from '@Repositories/user.repository';

import { UserEntity } from '@Entities/user.entity';

import { Payload } from '@Responses/payload';

@Injectable()
export class AuthenticationService {
  constructor(
    private userRepository: UserRepository,
    private configService: ConfigService,
    private jwtService: JwtService
  ) { }

  async getAcessToken(_user: UserEntity): Promise<string> {
    const secret = this.configService.get('secret.jwt');

    const payload: Payload = {
      id: _user.id,
      email: _user.email,
      firstName: _user.firstName,
    };

    const options = {
      expiresIn: '2d',
    }

    return this.jwtService.sign(payload, options);
  }

  async getRefreshToken(_user: UserEntity): Promise<string> {
    const secret = this.configService.get('secret.jwt');

    const payload: Payload = {
      id: _user.id,
      email: _user.email,
      firstName: _user.firstName,
    };

    const options = {
      expiresIn: '7d',
    }

    return this.jwtService.sign(payload, options);
  }
}
