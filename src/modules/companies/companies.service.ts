import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Like, Not, IsNull, getRepository, In, getManager } from 'typeorm';
import { InjectMapper } from '@automapper/nestjs';
import type { Mapper } from '@automapper/types';
import fs from 'fs';

// import { JobCandidateRepositoty } from '@Repositories/job-candidate.repository';
// import { JobEmployeeRepositoty } from '@Repositories/job-employee.repository';
import { CompanyRepository } from '@Repositories/company.repository';
import { JobRepository } from '@Repositories/job.repository';

import { BusinessFieldEntity } from '@Entities/business-field.entity';
import { CountryEntity } from '@Entities/country.entity';
import { CompanyEntity } from '@Entities/company.entity';
import { UserEntity } from '@Entities/user.entity';
import { AreaEntity } from '@Entities/area.entity';
import { JobEntity } from '@Entities/job.entity';

import {
  GetCompaniesFilterWithTheFirstCharacterInNameQueries,
  UpdateCompanyInformationRequest,
  UpdateCompanyInformationParams,
  GetJobsOfCompanyQueries,
  GetCompanyDetailParams,
  GetJobsOfCompanyParams,
} from './dtos/requests';
import { GetCompanyDetailResponse, GetJobsOfCompanyResponse, JobOfCompany } from './dtos/responses';

import { Company } from '@Shared/responses/company';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectMapper() private readonly mapper: Mapper,
    // private jobCandidateRepositoty: JobCandidateRepositoty,
    // private jobEmployeeRepositoty: JobEmployeeRepositoty,
    private companyRepository: CompanyRepository,
    private jobRepository: JobRepository,
  ) {}

  async getCompanies(
    getCompaniesFilterWithTheFirstCharacterInNameQueries: GetCompaniesFilterWithTheFirstCharacterInNameQueries,
  ): Promise<Company[]> {
    const page = getCompaniesFilterWithTheFirstCharacterInNameQueries.page;
    const character = getCompaniesFilterWithTheFirstCharacterInNameQueries.character;

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
    getJobsOfCompanyParams: GetJobsOfCompanyParams,
    getJobsOfCompanyQueries: GetJobsOfCompanyQueries,
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
        areaId: getJobsOfCompanyQueries.areaId != undefined ? getJobsOfCompanyQueries.areaId : Not(IsNull()),
        title: getJobsOfCompanyQueries.title != undefined ? Like(`%${getJobsOfCompanyQueries.title}%`) : Not(IsNull()),
        status: getJobsOfCompanyQueries.status != undefined ? getJobsOfCompanyQueries.status : Not(IsNull()),
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

  async updateCompanyInformation(
    _currentUser: UserEntity,
    _currentCompany: CompanyEntity,
    updateCompanyInformationParams: UpdateCompanyInformationParams,
    updateCompanyInformationRequest: UpdateCompanyInformationRequest,
    files: { logo?: Express.Multer.File[]; photos?: Express.Multer.File[] },
  ): Promise<GetCompanyDetailResponse> {
    const _company = await this.companyRepository.findOne({
      where: { id: updateCompanyInformationParams.companyId },
      relations: ['owner', 'country', 'businessFields', 'area', 'information'],
    });

    if (!_company) {
      throw new NotFoundException('Not found');
    }

    if (_company.id != _currentCompany.id) {
      throw new ForbiddenException('Forbidden Resource');
    }

    await getManager().transaction(async (transactionalEntityManager) => {
      const country = await getRepository(CountryEntity).findOne({ id: updateCompanyInformationRequest.countryId });
      const area = await getRepository(AreaEntity).findOne({ id: updateCompanyInformationRequest.areaId });

      if (!country || !area) {
        throw new NotFoundException("Can't find country or area");
      }

      _company.name = updateCompanyInformationRequest.name;

      _company.country = country;
      _company.area = area;
      _company.businessFields =
        updateCompanyInformationRequest.businessFieldIds != undefined &&
        updateCompanyInformationRequest.businessFieldIds.length != 0
          ? await getRepository(BusinessFieldEntity).find({ id: In(updateCompanyInformationRequest.businessFieldIds) })
          : [];

      const socialNetworks = JSON.parse(String(updateCompanyInformationRequest.socialNetworks));

      _company.information.dateOfEstablishment = updateCompanyInformationRequest.dateOfEstablishment;
      _company.information.socialNetworks = socialNetworks;
      _company.information.numberOfEmployees = updateCompanyInformationRequest.numberOfEmployees;
      _company.information.phoneNumber = updateCompanyInformationRequest.phoneNumber;
      _company.information.description = updateCompanyInformationRequest.description;
      _company.information.paxNumber = updateCompanyInformationRequest.paxNumber;
      _company.information.updatedAt = new Date();
      _company.information.addresses =
        updateCompanyInformationRequest.addresses != undefined && updateCompanyInformationRequest.addresses.length != 0
          ? updateCompanyInformationRequest.addresses.join('|')
          : '';

      if (files.logo != undefined && files.logo.length == 1) {
        if (_company.logo != '') {
          fs.unlinkSync(`./public/companies/logos/${_company.logo}`);
        }
        _company.logo = files.logo[0].filename;
      }

      if (files.photos != undefined && files.photos.length != 0) {
        if (_company.information.photos != '') {
          const oldPhotos = _company.information.photos.split('|').filter((photo) => photo);
          for (const oldPhoto of oldPhotos) {
            fs.unlinkSync(`./public/companies/photos/${oldPhoto}`);
          }
        }
        _company.information.photos = files.photos.map((photo) => photo.filename).join('|');
      }

      await transactionalEntityManager.save(_company);
    });

    return this.mapper.map(_company, GetCompanyDetailResponse, CompanyEntity);
  }
}
