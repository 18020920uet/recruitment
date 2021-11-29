import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { UserRepository } from '@Repositories/user.repository';
import { CompanyEmployeeRepository } from '@Repositories/company-employee.repository';

import { JwtAuthenticationGuard } from '@Common/guard/jwt-authentication.guard';
import { CompanyGuard } from '@Common/guard/company.guard';

import { AuthenticationService } from './authentication.service';
import { AuthenticationController } from './authentication.controller';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([UserRepository, CompanyEmployeeRepository]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('secret.jwt'),
      }),
    }),
  ],
  providers: [AuthenticationService, JwtStrategy, CompanyGuard, JwtAuthenticationGuard],
  controllers: [AuthenticationController],
  exports: [AuthenticationService],
})
export class AuthenticationModule {}
