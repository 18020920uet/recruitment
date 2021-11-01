import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserRepository } from '@Repositories/user.repository';

import { AuthenticationModule } from '@Modules/authentication/authentication.module';

import { UserService } from './user.service';
import { UserController } from './user.controller';

import { CurriculumVitaeRepository } from '@Repositories/curriculum-vitae.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserRepository]),
    TypeOrmModule.forFeature([CurriculumVitaeRepository]),
    AuthenticationModule // JwtAuthenticationGuard
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
