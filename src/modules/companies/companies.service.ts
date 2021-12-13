import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Like, Not, IsNull, getRepository, In, getManager } from 'typeorm';
import { InjectMapper } from '@automapper/nestjs';
import type { Mapper } from '@automapper/types';
import fs from 'fs';

import { JobEmployeeRepositoty } from '@Repositories/job-employee.repository';
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
  UpdateCompanyPhotosParams,
  GetCompanyAnalysisParams,
  ChangeCompanyLogoParams,
  GetJobsOfCompanyQueries,
  GetCompanyDetailParams,
  GetJobsOfCompanyParams,
} from './dtos/requests';
import {
  UpdateCompanyPhotosResponse,
  GetCompanyAnalysisResponse,
  ChangeCompanyLogoResponse,
  GetCompanyDetailResponse,
  GetJobsOfCompanyResponse,
  JobOfCompany,
} from './dtos/responses';

import { Company } from '@Shared/responses/company';
import { JobStatus } from '@Shared/enums/job-status';
import { JobEmployeeStatus } from '@Shared/enums/job-employee-status';
import { ReviewRepository } from '@Repositories/review.repository';
import { ReviewBy } from '@Shared/enums/review-by';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectMapper() private readonly mapper: Mapper,
    private jobEmployeeRepositoty: JobEmployeeRepositoty,
    private companyRepository: CompanyRepository,
    private reviewRepository: ReviewRepository,
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

      _company.information.dateOfEstablishment = updateCompanyInformationRequest.dateOfEstablishment;
      _company.information.socialNetworks = updateCompanyInformationRequest.socialNetworks;
      _company.information.numberOfEmployees = updateCompanyInformationRequest.numberOfEmployees;
      _company.information.phoneNumber = updateCompanyInformationRequest.phoneNumber;
      _company.information.description = updateCompanyInformationRequest.description;
      _company.information.paxNumber = updateCompanyInformationRequest.paxNumber;
      _company.information.updatedAt = new Date();
      _company.information.addresses =
        updateCompanyInformationRequest.addresses != undefined && updateCompanyInformationRequest.addresses.length != 0
          ? updateCompanyInformationRequest.addresses.join('|')
          : '';
      await transactionalEntityManager.save(_company);
    });

    return this.mapper.map(_company, GetCompanyDetailResponse, CompanyEntity);
  }

  async changeCompanyLogo(
    _currentUser: UserEntity,
    _currentCompany: CompanyEntity,
    changeCompanyLogoParams: ChangeCompanyLogoParams,
    logo: Express.Multer.File,
  ): Promise<ChangeCompanyLogoResponse> {
    const _company = await this.companyRepository.findOne({
      where: { id: changeCompanyLogoParams.companyId },
    });

    if (!_company) {
      throw new NotFoundException('Not found');
    }

    if (_company.id != _currentCompany.id) {
      throw new ForbiddenException('Forbidden Resource');
    }

    if (logo != undefined) {
      if (_company.logo != '') {
        fs.unlinkSync(`./public/companies/logos/${_company.logo}`);
      }
      _company.logo = logo.filename;
      await this.companyRepository.save(_company);
    }

    const response = new ChangeCompanyLogoResponse();
    if (_company.logo != '') {
      response.logo = `${process.env.HOST}/public/companies/logos/${_company.logo}`;
    } else {
      response.logo = `${process.env.HOST}/resources/images/company-logo.png`;
    }
    return response;
  }

  async updateCompanyPhotos(
    _currentUser: UserEntity,
    _currentCompany: CompanyEntity,
    updateCompanyPhotosParams: UpdateCompanyPhotosParams,
    photos: Express.Multer.File[],
  ): Promise<UpdateCompanyPhotosResponse> {
    const _company = await this.companyRepository.findOne({
      where: { id: updateCompanyPhotosParams.companyId },
      relations: ['information'],
    });

    if (photos != undefined && photos.length != 0) {
      if (_company.information.photos != '') {
        const oldPhotos = _company.information.photos.split('|').filter((photo) => photo);
        for (const oldPhoto of oldPhotos) {
          fs.unlinkSync(`./public/companies/photos/${oldPhoto}`);
        }
      }
      _company.information.photos = photos
        .filter((photo) => photo)
        .map((photo) => photo.filename)
        .join('|');
    }

    const response = new UpdateCompanyPhotosResponse();
    response.photos = [];

    if (photos != undefined && photos.length != 0) {
      for (const photo of photos) {
        if (photo != undefined) {
          response.photos.push(`${process.env.HOST}/public/companies/photos/${photo.filename}`);
        }
      }
    }

    return response;
  }

  async getCompanyAnalysis(getCompanyAnalysisParams: GetCompanyAnalysisParams): Promise<GetCompanyAnalysisResponse> {
    const _company = await this.companyRepository.findOne({ id: getCompanyAnalysisParams.companyId });
    if (!_company) {
      throw new NotFoundException('Not found');
    }

    const _jobs = await this.jobRepository.find({
      where: { company: { id: _company.id } },
      relations: ['area', 'skills'],
    });

    const response = new GetCompanyAnalysisResponse();
    response.totalPostedJobs = _jobs.length;

    response.areas = [];
    response.skills = [];

    response.currentWorkingJobs = 0;
    response.totalPendingJobs = 0;
    response.totalCancelJobs = 0;
    response.totalAwaitJobs = 0;
    response.totalDoneJobs = 0;

    response.lowestJobSalaryPay = _jobs.length != 0 ? _jobs[0].salary : 0;
    response.highestJobSalaryPay = 0;
    response.totalSalaryPay = 0;

    for (const _job of _jobs) {
      if (_job.status == JobStatus.DONE) {
        response.totalDoneJobs++;
        if (_job.salary > response.highestJobSalaryPay) {
          response.highestJobSalaryPay = _job.salary;
        }
        if (_job.salary < response.lowestJobSalaryPay) {
          response.lowestJobSalaryPay = _job.salary;
        }
        response.totalSalaryPay += _job.salary;
      } else if (_job.status == JobStatus.CANCEL) {
        response.totalCancelJobs++;
      } else if (_job.status == JobStatus.INPROGRESS) {
        response.currentWorkingJobs++;
      } else if (_job.status == JobStatus.PENDING) {
        response.totalPendingJobs++;
      } else if (_job.status == JobStatus.AWAIT) {
        response.totalAwaitJobs++;
      }

      if (_job.area) {
        const areaIndex = response.areas.findIndex((area) => area.id == _job.area.id);
        if (areaIndex == -1) {
          response.areas.push({
            countryId: _job.area.countryId,
            name: _job.area.name,
            id: _job.area.id,
            total: 1,
          });
        } else {
          response.areas[areaIndex].total++;
        }
      }

      if (_job.skills) {
        for (const _skill of _job.skills) {
          const skillIndex = response.skills.findIndex((skill) => skill.id == _skill.id);
          if (skillIndex == -1) {
            response.skills.push({
              id: _skill.id,
              name: _skill.name,
              total: 1,
            });
          } else {
            response.skills[skillIndex].total++;
          }
        }
      }
    }

    const _jobEmployeeRelations = await this.jobEmployeeRepositoty.find({
      where: { job: { companyId: _company.id } },
      relations: ['job'],
    });

    response.currentEmployeesWorking = _jobEmployeeRelations.filter(
      (_jER) => _jER.jobEmployeeStatus == JobEmployeeStatus.WORKING,
    ).length;
    response.totalHiredEmployees = _jobEmployeeRelations.length;

    response.highestReviewPoint = 0;
    response.lowestReviewPoint = 0;

    response.totalReviews = _company.totalReviews;
    response.rate = _company.totalReviews == 0 ? 0 : _company.reviewPoint / (_company.totalReviews * 5);
    const _reviews = await this.reviewRepository.find({
      where: { job: { companyId: _company.id } },
      relations: ['job', 'job.company'],
    });

    response.totalReviewsWritten = _reviews.filter((_review) => _review.reviewBy == ReviewBy.COMPANY).length;

    const _reviewsByUser = _reviews.filter((_review) => _review.reviewBy == ReviewBy.FREELANCE);

    response.highestReviewPoint = 0;
    response.lowestReviewPoint = _reviewsByUser.length != 0 ? _reviewsByUser[0].rate : 0;

    for (const _review of _reviewsByUser) {
      if (_review.rate < response.lowestReviewPoint) {
        response.lowestReviewPoint = _review.rate;
      }

      if (_review.rate > response.highestReviewPoint) {
        response.highestReviewPoint = _review.rate;
      }
    }

    return response;
  }
}
