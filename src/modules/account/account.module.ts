import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

import { AuthenticationModule } from '@Modules/authentication/authentication.module';

import { ApplicationMapperProfile } from '@Common/application.mapper.profile';

import { UserRepository } from '@Repositories/user.repository';

import { AccountController } from './account.controller';
import { AccountService } from './account.service';

import { MailModule } from '@Modules/mail/mail.module';
import { MailService } from '@Modules/mail/mail.service';


@Module({
  imports: [
    MailModule,
    ConfigModule,
    AuthenticationModule,
    TypeOrmModule.forFeature([UserRepository]),
  ],
  controllers: [AccountController],
  providers: [ApplicationMapperProfile, AccountService, MailService],
})
export class AccountModule {}
