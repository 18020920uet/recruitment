import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CurriculumVitaeRepository } from '@Repositories/curriculum-vitae.repository';
import { ReviewRepository } from '@Repositories/review.repository';
import { UserRepository } from '@Repositories/user.repository';

import { AuthenticationModule } from '@Modules/authentication/authentication.module';

import { UserController } from './user.controller';

import { UserService } from './user.service';
import { FileService } from '@Shared/services/file.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([CurriculumVitaeRepository, ReviewRepository, UserRepository]),
    AuthenticationModule, // JwtAuthenticationGuard
    ConfigModule,
  ],
  controllers: [UserController],
  providers: [UserService, FileService],
})
export class UserModule {}
