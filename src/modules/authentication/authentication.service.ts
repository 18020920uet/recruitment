import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { CompanyEmployeeRepository } from '@Repositories/company-employee.repository';
import { UserRepository } from '@Repositories/user.repository';

import { UserEntity } from '@Entities/user.entity';
import { CompanyEmployeeEntity } from '@Entities/company-employee.entity';

import { Payload } from '@Shared/responses/payload';

import { RefreshAccessTokenResponse } from './dtos/responses';

@Injectable()
export class AuthenticationService {
  constructor(
    private companyEmployeeRepository: CompanyEmployeeRepository,
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async validateUser(userId: string): Promise<UserEntity> {
    return await this.userRepository.findOne(userId, { relations: ['employeeOfCompany', 'employeeOfCompany.company'] });
  }

  async generateAccessToken(_user: UserEntity): Promise<string> {
    const payload: Payload = {
      id: _user.id,
      email: _user.email,
      firstName: _user.firstName,
    };
    return this.jwtService.sign(payload, { expiresIn: '36000s' });
  }

  async generateRefreshToken(_user: UserEntity): Promise<string> {
    const payload: Payload = {
      id: _user.id,
      email: _user.email,
      firstName: _user.firstName,
    };
    return this.jwtService.sign(payload, { expiresIn: '36000s' });
  }

  async generateNewAccessToken(refreshToken: string): Promise<RefreshAccessTokenResponse> {
    try {
      const { iat, exp, ...payload } = await this.jwtService.verifyAsync(refreshToken);
      const accessToken = await this.jwtService.signAsync(payload, { expiresIn: '36000s' });
      return {
        newAccessToken: accessToken,
      };
    } catch (error) {
      if (error.name == 'TokenExpiredError') {
        throw new UnauthorizedException('Token Expired');
      }
    }
  }

  async validateCompanyEmployee(userId: string): Promise<CompanyEmployeeEntity> {
    const _companyRole = await this.companyEmployeeRepository.findOne({
      where: { userId: userId },
      relations: ['company', 'company.area'],
    });

    return _companyRole;
  }
}
