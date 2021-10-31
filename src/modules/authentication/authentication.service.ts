import { ConfigService } from '@nestjs/config';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UserRepository } from '@Repositories/user.repository';

import { UserEntity } from '@Entities/user.entity';

import { Payload } from '@Shared/responses/payload';

import { RefreshAccessTokenResponse } from './dtos/responses';

@Injectable()
export class AuthenticationService {
  constructor(
    private userRepository: UserRepository,
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  async validateUser(userId: string): Promise<UserEntity> {
    return await this.userRepository.findOne(userId);
  }

  async generateAccessToken(_user: UserEntity): Promise<string> {
    const payload: Payload = {
      id: _user.id,
      email: _user.email,
      firstName: _user.firstName,
    };
    return this.jwtService.sign(payload, { expiresIn: '600s' });
  }

  async generateRefreshToken(_user: UserEntity): Promise<string> {
    const payload: Payload = {
      id: _user.id,
      email: _user.email,
      firstName: _user.firstName,
    };
    return this.jwtService.sign(payload, { expiresIn: '1200s' });
  }

  async generateNewAccessToken(refreshToken: string): Promise<RefreshAccessTokenResponse> {
    try {
      const { iat, exp, ...payload } = await this.jwtService.verifyAsync(refreshToken);
      const accessToken = await this.jwtService.sign(payload, { expiresIn: '300s' });
      return {
        newAccessToken: accessToken,
      };
    } catch (error) {
      if (error.name == 'TokenExpiredError') {
        throw new UnauthorizedException('Token Expired');
      }
    }
  }
}
