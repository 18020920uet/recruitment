import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';

import { CompanyRepository } from '@Repositories/company.repository';

import { CompaniesService } from './companies.service';
import { CompaniesController } from './companies.controller';


@Module({
  imports: [
    TypeOrmModule.forFeature([
      CompanyRepository,
    ]),
    ConfigModule,
  ],
  providers: [CompaniesService],
  controllers: [CompaniesController]
})
export class CompaniesModule {}
