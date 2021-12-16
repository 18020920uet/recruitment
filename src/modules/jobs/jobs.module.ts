import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { JobCandidateRepositoty } from '@Repositories/job-candidate.repository';
import { JobEmployeeRepositoty } from '@Repositories/job-employee.repository';
import { ReviewRepository } from '@Repositories/review.repository';
import { SkillRepository } from '@Repositories/skill.repository';
import { JobRepository } from '@Repositories/job.repository';

import { JobsController } from './jobs.controller';

import { JobsService } from './jobs.service';

import { AuthenticationModule } from '@Modules/authentication/authentication.module';
import { CurriculumVitaeRepository } from '@Repositories/curriculum-vitae.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CurriculumVitaeRepository,
      JobCandidateRepositoty,
      JobEmployeeRepositoty,
      ReviewRepository,
      SkillRepository,
      JobRepository,
    ]),
    AuthenticationModule, // JwtAuthenticationGuard
    ConfigModule,
  ],
  providers: [JobsService],
  controllers: [JobsController],
})
export class JobsModule {}
