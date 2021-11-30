import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectMapper } from '@automapper/nestjs';
import type { Mapper } from '@automapper/types';
import { Like, Not, IsNull } from 'typeorm';

import { JobCandidateRepositoty } from '@Repositories/job-candidate.repository';
import { JobEmployeeRepositoty } from '@Repositories/job-employee.repository';
import { CompanyRepository } from '@Repositories/company.repository';
import { JobRepository } from '@Repositories/job.repository';

import { CompanyEntity } from '@Entities/company.entity';


import { GetCompaniesFilterWithTheFirstCharacterInNameQuery, GetCompanyDetailParams, GetJobsOfCompanyParams, GetJobsOfCompanyQueries } from './dtos/requests';
import { GetCompanyDetailResponse, GetJobsOfCompanyResponse, JobOfCompany } from './dtos/responses';
import { Company } from '@Shared/responses/company';
import { JobEntity } from '@Entities/job.entity';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectMapper() private readonly mapper: Mapper,
    private jobCandidateRepositoty: JobCandidateRepositoty,
    private jobEmployeeRepositoty: JobEmployeeRepositoty,
    private companyRepository: CompanyRepository,
    private jobRepository: JobRepository,
  ) {}

  async getCompanies(
    getCompaniesFilterWithTheFirstCharacterInNameQuery: GetCompaniesFilterWithTheFirstCharacterInNameQuery,
  ): Promise<Company[]> {
    const page = getCompaniesFilterWithTheFirstCharacterInNameQuery.page;
    const character = getCompaniesFilterWithTheFirstCharacterInNameQuery.character;

    const _companies = await this.companyRepository.find({
      where:
        character != undefined
          ? [{ name: Like(`${character.toLowerCase()}%`) }, { name: Like(`${character.toUpperCase()}%`) }]
          : { name: Not(IsNull()) },
      relations: ['country', 'area'],
      skip: page > 0 ? page - 1 : 0 * (character != undefined ? 6 : 10),
      take: character != undefined ? 6 : 10,
      order: { name: 'ASC' },
    });
    return _companies.map((_company) => this.mapper.map(_company, Company, CompanyEntity));
  }

  async getCompanyDetail(getCompanyDetailParams: GetCompanyDetailParams): Promise<GetCompanyDetailResponse> {
    const _company = await this.companyRepository.findOne({
      where: { id: getCompanyDetailParams.companyId },
      relations: ['country', 'information', 'businessFields', 'area'],
    });
    return this.mapper.map(_company, GetCompanyDetailResponse, CompanyEntity);
  }

  async getJobsOfCompany(
    getJobsOfCompanyParams: GetJobsOfCompanyParams, getJobsOfCompanyQueries: GetJobsOfCompanyQueries
  ): Promise<GetJobsOfCompanyResponse> {
    console.log(getJobsOfCompanyQueries.withDeleted);
    const _company = await this.companyRepository.findOne({ id: getJobsOfCompanyParams.companyId });

    if (!_company) {
      throw new NotFoundException('Not found');
    }

    const records = getJobsOfCompanyQueries.records != undefined ? getJobsOfCompanyQueries.records : 10;

    const [_jobs, totalRecords] = await this.jobRepository.findAndCount({
      where: {
        companyId: getJobsOfCompanyParams.companyId,
        areaId: getJobsOfCompanyQueries.areaId != undefined ?
          getJobsOfCompanyQueries.areaId : Not(IsNull()),
        title: getJobsOfCompanyQueries.title != undefined ? Like(`%${getJobsOfCompanyQueries.title}%`) : Not(IsNull()),
        status: getJobsOfCompanyQueries.status != undefined ? getJobsOfCompanyQueries.status : Not(IsNull())
      },
      relations: ['employeeRelations', 'candidateRelations', 'area', 'businessFields', 'skills'],
      withDeleted: getJobsOfCompanyQueries.withDeleted,
      skip: (getJobsOfCompanyQueries.page > 0 ? getJobsOfCompanyQueries.page - 1 : 0) * records,
      take: records,
    });

    const response = new GetJobsOfCompanyResponse();
    response.jobs = _jobs.map((_job) => this.mapper.map(_job, JobOfCompany, JobEntity));
    response.totalRecods = totalRecords;
    return response;
  }
}
