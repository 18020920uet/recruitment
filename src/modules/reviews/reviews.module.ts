import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthenticationModule } from '@Modules/authentication/authentication.module';

import { JobCandidateRepositoty } from '@Repositories/job-candidate.repository';
import { JobEmployeeRepositoty } from '@Repositories/job-employee.repository';
import { ReviewRepository } from '@Repositories/review.repository';
import { UserRepository } from '@Repositories/user.repository';
import { JobRepository } from '@Repositories/job.repository';

import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';
import { CompanyRepository } from '@Repositories/company.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      JobCandidateRepositoty,
      JobEmployeeRepositoty,
      CompanyRepository,
      ReviewRepository,
      UserRepository,
      JobRepository,
    ]),
    AuthenticationModule, // JwtAuthenticationGuard
  ],
  controllers: [ReviewsController],
  providers: [ReviewsService],
})
export class ReviewsModule {}
