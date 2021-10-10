import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectMapper } from '@automapper/nestjs';
import type { Mapper } from '@automapper/types';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UserRepository } from '@Repositories/user.repository';
import { UserEntity } from '@Entities/user.entity';

import { User } from '@Responses/user';

import { RegisterRequest } from './dtos/requests.dto';
import { RegisterResponse } from './dtos/responses.dto';


@Injectable()
export class AccountService {
  constructor(
    @InjectMapper() private readonly mapper: Mapper,
    private userRepository: UserRepository,
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  async register(registerRequest: RegisterRequest): Promise<RegisterResponse> {
    const emailExists = await this.userRepository.checkEmailExists(registerRequest.email);

    if (emailExists != true) {
      throw new HttpException('This email has been used', HttpStatus.CONFLICT);
    }

    const saltRounds = this.configService.get<number>('bscryptSlatRounds');
    const hashPassword = await bcrypt.hash(registerRequest.password, saltRounds);

    const user = new UserEntity();
    user.email = registerRequest.email;
    user.password = hashPassword;
    user.firstName = registerRequest.firstName;
    user.lastName = registerRequest.lastName;
    user.isActivated = false;
    user.activateCode = Math.random().toString(36).slice(-7);

    await this.userRepository.save(user);

    const activeUrlPayload =  {
      userId: user.id,
      activateCode: user.activateCode
    };

    const activeToken = this.jwtService.sign(activeUrlPayload, { expiresIn: '2d' });
    const host = this.configService.get<string>('host');
    const activeUrl = `${host}/account/active?token=${activeToken}`;

    // Send active url to user emailExists
    return {
      user: this.mapper.map(user, User, UserEntity),
      accessToken: activeToken,
      refreshToken: activeToken
    }
  }
}
