import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { JobsService } from './jobs.service';
import { JobsController } from './jobs.controller';

import { ReviewRepository } from '@Repositories/review.repository';
import { SkillRepository } from '@Repositories/skill.repository';
import { JobRepository } from '@Repositories/job.repository';
import { JobEmployeeRepositoty } from '@Repositories/job-employee.repository';
import { JobCandidateRepositoty } from '@Repositories/job-candidate.repository';

import { AuthenticationModule } from '@Modules/authentication/authentication.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ReviewRepository,
      SkillRepository,
      JobRepository,
      JobCandidateRepositoty,
      JobEmployeeRepositoty,
    ]),
    AuthenticationModule, // JwtAuthenticationGuard
    ConfigModule,
  ],
  providers: [JobsService],
  controllers: [JobsController],
})
export class JobsModule {}
