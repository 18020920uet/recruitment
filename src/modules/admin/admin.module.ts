import { AuthenticationModule } from '@Modules/authentication/authentication.module';
import { UsersService } from '@Modules/users/users.service';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CurriculumVitaeRepository } from '@Repositories/curriculum-vitae.repository';
import { ReviewRepository } from '@Repositories/review.repository';
import { UserRepository } from '@Repositories/user.repository';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([CurriculumVitaeRepository, ReviewRepository, UserRepository]),
    AuthenticationModule,
    ConfigModule,
  ],
  controllers: [AdminController],
  providers: [AdminService, UsersService],
})
export class AdminModule {}
