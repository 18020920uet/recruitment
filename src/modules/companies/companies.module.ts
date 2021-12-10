import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';

import { JobCandidateRepositoty } from '@Repositories/job-candidate.repository';
import { JobEmployeeRepositoty } from '@Repositories/job-employee.repository';
import { CompanyRepository } from '@Repositories/company.repository';
import { ReviewRepository } from '@Repositories/review.repository';
import { JobRepository } from '@Repositories/job.repository';

import { CompaniesController } from './companies.controller';

import { CompaniesService } from './companies.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CompanyRepository,
      JobRepository,
      JobCandidateRepositoty,
      JobEmployeeRepositoty,
      ReviewRepository,
    ]),
    ConfigModule,
  ],
  providers: [CompaniesService],
  controllers: [CompaniesController],
})
export class CompaniesModule {}
