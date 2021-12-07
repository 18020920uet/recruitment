import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';

import { CompanyEmployeeRepository } from '@Repositories/company-employee.repository';
import { CurriculumVitaeRepository } from '@Repositories/curriculum-vitae.repository';
import { JobCandidateRepositoty } from '@Repositories/job-candidate.repository';
import { JobEmployeeRepositoty } from '@Repositories/job-employee.repository';
import { CompanyRepository } from '@Repositories/company.repository';
import { ReviewRepository } from '@Repositories/review.repository';
import { UserRepository } from '@Repositories/user.repository';

import { AuthenticationModule } from '@Modules/authentication/authentication.module';

import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CurriculumVitaeRepository,
      CompanyEmployeeRepository,
      JobCandidateRepositoty,
      JobEmployeeRepositoty,
      CompanyRepository,
      ReviewRepository,
      UserRepository,
    ]),
    AuthenticationModule,
    ConfigModule,
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
