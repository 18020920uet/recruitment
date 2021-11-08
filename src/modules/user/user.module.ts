import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserRepository } from '@Repositories/user.repository';
import { ReviewRepository } from '@Repositories/review.repository';
import { CurriculumVitaeRepository } from '@Repositories/curriculum-vitae.repository';

import { AuthenticationModule } from '@Modules/authentication/authentication.module';

import { UserService } from './user.service';
import { UserController } from './user.controller';

import { PhotoService } from '@Shared/services/photo.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CurriculumVitaeRepository,
      ReviewRepository,
      UserRepository,
    ]),
    AuthenticationModule, // JwtAuthenticationGuard
    ConfigModule,
  ],
  controllers: [UserController],
  providers: [UserService, PhotoService],
})
export class UserModule {}
