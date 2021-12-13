import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { IsNull, Not, MoreThanOrEqual, In, getManager, getRepository, Like, Between, LessThanOrEqual } from 'typeorm';
import { InjectMapper } from '@automapper/nestjs';
import type { Mapper } from '@automapper/types';

import { JobCandidateRepositoty } from '@Repositories/job-candidate.repository';
import { JobEmployeeRepositoty } from '@Repositories/job-employee.repository';
import { JobRepository } from '@Repositories/job.repository';

import { JobCandidateRelation } from '@Entities/job-candidate.relation';
import { BusinessFieldEntity } from '@Entities/business-field.entity';
import { JobEmployeeRelation } from '@Entities/job-employee.relation';
import { CompanyEntity } from '@Entities/company.entity';
import { SkillEntity } from '@Entities/skill.entity';
import { AreaEntity } from '@Entities/area.entity';
import { UserEntity } from '@Entities/user.entity';
import { JobEntity } from '@Entities/job.entity';

import {
  ChangeEmployeeStatusJobParams,
  RemoveEmployeeFromJobParams,
  ChangeJobApplyStatusRequest,
  GetCandidatesOfJobQuerires,
  ChangeJobApplyStatusParams,
  GetEmployeesOfJobQuerires,
  CompletedJobByUserParams,
  GetCandidatesOfJobParams,
  GetEmployeesOfJobParams,
  RemoveApplicationParams,
  GetJobDetailParams,
  UpdateJobRequest,
  CreateJobRequest,
  FinishJobParams,
  UpdateJobParams,
  ApplyJobRequest,
  DeleteJobParams,
  GetJobsQueries,
  ApplyJobParams,
} from './dtos/requests';
import {
  GetCandidatesOfJobResponse,
  GetEmployeesOfJobResponse,
  GetJobDetailResponse,
  DeleteJobResponse,
  FinishJobResponse,
  GetJobsResponse,
  CandidateOfJob,
  EmployeeOfJob,
  JobDetail,
} from './dtos/responses';
import { Job } from '@Shared/responses/job';

import { RelatedJobFilter } from '@Shared/enums/related-job-filter';
import { JobStatus } from '@Shared/enums/job-status';

import { JobEmployeeStatus } from '@Shared/enums/job-employee-status';
import { JobApplyStatus } from '@Shared/enums/job-apply-status';

@Injectable()
export class JobsService {
  constructor(
    @InjectMapper() private readonly mapper: Mapper,
    private jobCandidateRepositoty: JobCandidateRepositoty,
    private jobEmployeeRepositoty: JobEmployeeRepositoty,
    private jobRepository: JobRepository,
  ) {}

  async getJobs(getJobsQueries: GetJobsQueries): Promise<GetJobsResponse> {
    if (getJobsQueries.statuses != undefined && getJobsQueries.statuses.length != 0) {
      const jobStatuses = Object.values(JobStatus);
      for (const inputStatus of getJobsQueries.statuses) {
        if (!jobStatuses.includes(inputStatus)) {
          throw new BadRequestException('Unknown job status');
        }
      }
    }

    let jobIds: number[] = [];

    if (getJobsQueries.skillIds != undefined && getJobsQueries.skillIds.length != 0) {
      const skillIds = getJobsQueries.skillIds;
      const params = skillIds.map((skillId) => `${skillId}`).join(',');
      const queryString = `SELECT job_id FROM "jobs_skills" WHERE skill_id IN (${params}) GROUP BY job_id, skill_id`;
      jobIds = (await getManager().query(queryString)).map((r: { job_id: number }) => r.job_id);
    }

    if (getJobsQueries.businessFieldIds != undefined && getJobsQueries.businessFieldIds.length != 0) {
      const businessFieldIds = getJobsQueries.businessFieldIds;
      const params = businessFieldIds.map((businessFieldId) => `${businessFieldId}`).join(',');
      const params2 = jobIds.map((jobId) => `${jobId}`).join(',');
      const queryString =
        `SELECT job_id FROM "jobs_business_fields" WHERE business_field_id IN (${params}) ` +
        `AND job_id IN (${params2}) GROUP BY job_id, business_field_id`;
      jobIds = (await getManager().query(queryString)).map((r: { job_id: number }) => r.job_id);
    }

    if (getJobsQueries.title != undefined) {
      const title = getJobsQueries.title;
      if (!title.includes("')") && !title.includes('")')) {
        const params = jobIds.map((jobId) => `${jobId}`).join(',');
        jobIds = (
          await getRepository(JobEntity)
            .createQueryBuilder('job')
            .where((jobIds.length != 0 ? `id IN (${params}) AND` : '') + ` title @@ to_tsquery('${title}')`)
            .select('job.id')
            .getMany()
        ).map((_job) => _job.id);
      }
    }

    const records = getJobsQueries.records != undefined ? getJobsQueries.records : 10;

    const [_jobs, totalRecods] = await this.jobRepository.findAndCount({
      where: {
        id: jobIds.length != 0 ? In(jobIds) : Not(IsNull()),
        experience: getJobsQueries.experience != undefined ? getJobsQueries.experience : Not(IsNull()),
        title: getJobsQueries.title != undefined ? Like(`%${getJobsQueries.title}%`) : Not(IsNull()),
        startDate:
          getJobsQueries.startDateBegin != undefined && getJobsQueries.startDateEnd != undefined
            ? Between(getJobsQueries.startDateBegin, getJobsQueries.startDateEnd)
            : getJobsQueries.startDateBegin != undefined && getJobsQueries.startDateEnd == undefined
            ? MoreThanOrEqual(getJobsQueries.startDateBegin)
            : getJobsQueries.startDateBegin == undefined && getJobsQueries.startDateEnd != undefined
            ? LessThanOrEqual(getJobsQueries.startDateEnd)
            : Not(IsNull()),
        workMode: getJobsQueries.workMode != undefined ? getJobsQueries.workMode : Not(IsNull()),
        salary: getJobsQueries.salary != undefined ? getJobsQueries.salary : MoreThanOrEqual(0),
        status:
          getJobsQueries.statuses != undefined && getJobsQueries.statuses.length != 0
            ? In(getJobsQueries.statuses)
            : Not(IsNull()),
        area: {
          id: getJobsQueries.areaId != undefined ? getJobsQueries.areaId : Not(IsNull()),
        },
      },
      relations: ['area', 'skills', 'businessFields', 'company'],
      skip: (getJobsQueries.page > 0 ? getJobsQueries.page - 1 : 0) * records,
      take: records,
      order: { createdAt: 'DESC' },
    });

    const response = new GetJobsResponse();
    response.totalRecords = totalRecods;
    response.jobs = _jobs.map((_job) => this.mapper.map(_job, Job, JobEntity));
    return response;
  }

  async getJobDetail(getJobDetailParams: GetJobDetailParams): Promise<GetJobDetailResponse> {
    const _job = await this.jobRepository.findOne({
      where: { id: getJobDetailParams.jobId },
      relations: ['area', 'skills', 'businessFields', 'company'],
      withDeleted: true,
    });

    if (!_job) {
      throw new NotFoundException('Not found');
    }

    let _relatedJobs: JobEntity[] = [];

    const relatedJobsFilters = Object.values(RelatedJobFilter);
    const relatedJobsFilter = relatedJobsFilters[Math.floor(Math.random() * relatedJobsFilters.length)];

    switch (relatedJobsFilter) {
      case RelatedJobFilter.COMPANY: {
        const _tempRelatedJobs = await this.jobRepository.find({
          where: { companyId: _job.companyId },
          relations: ['area', 'skills', 'businessFields', 'company'],
        });
        if (_tempRelatedJobs.length != 0) {
          _relatedJobs = _tempRelatedJobs.sort(() => 0.5 - Math.random()).slice(0, 3);
          break;
        }
      }
      case RelatedJobFilter.BUSINESSFIELD: {
        const businessFieldIds = _job.businessFields.map((businessField) => businessField.id);
        const params = businessFieldIds.map((id) => `${id}`).join(',');
        const query =
          `SELECT job_id FROM "jobs_business_fields" WHERE business_field_id IN (${params}) ` +
          'GROUP BY job_id, business_field_id';
        const jobIds = (await getManager().query(query)).map((r: { job_id: number }) => r.job_id);
        if (jobIds.length != 0) {
          _relatedJobs = (
            await this.jobRepository.find({
              where: { id: jobIds.length != 0 ? In(jobIds) : Not(IsNull()) },
              relations: ['area', 'skills', 'businessFields', 'company'],
              order: { createdAt: 'DESC' },
            })
          )
            .sort(() => 0.5 - Math.random())
            .slice(0, 3);
          break;
        }
      }
      default: {
        const params = _job.skills.map((skill) => `${skill.id}`);
        const query = `SELECT job_id FROM "jobs_skills" WHERE skill_id IN (${params}) GROUP BY job_id, skill_id`;
        const jobIds = (await getManager().query(query)).map((r: { job_id: number }) => r.job_id);
        _relatedJobs = (
          await this.jobRepository.find({
            where: { id: jobIds.length != 0 ? In(jobIds) : Not(IsNull()) },
            relations: ['area', 'skills', 'businessFields', 'company'],
            order: { createdAt: 'DESC' },
          })
        )
          .sort(() => 0.5 - Math.random())
          .slice(0, 3);
      }
    }

    const response = new GetJobDetailResponse();
    response.jobDetail = this.mapper.map(_job, JobDetail, JobEntity);
    response.relatedJobs = _relatedJobs.map((_relatedJob) => this.mapper.map(_relatedJob, Job, JobEntity));
    return response;
  }

  async createJob(
    _currentUser: UserEntity,
    _currentCompany: CompanyEntity,
    createJobRequest: CreateJobRequest,
  ): Promise<JobDetail> {
    const _job = new JobEntity();
    _job.maxEmployees = createJobRequest.maxEmployees;
    _job.minEmployees = createJobRequest.minEmployees;
    _job.description = createJobRequest.description;
    _job.startDate = createJobRequest.startDate;
    _job.workMode = createJobRequest.workMode;
    _job.endDate = createJobRequest.endDate;
    _job.salary = createJobRequest.salary;
    _job.title = createJobRequest.title;
    _job.status = JobStatus.AWAIT;
    _job.company = _currentCompany;
    _job.creator = _currentUser;

    _job.createdAt = new Date();
    _job.updatedAt = _job.createdAt;

    _job.skills = await getRepository(SkillEntity).find({ where: { id: In(createJobRequest.skillIds) } });

    _job.area =
      createJobRequest.areaId == 0
        ? _currentCompany.area
        : await getRepository(AreaEntity).findOne({ id: createJobRequest.areaId });

    _job.experience = createJobRequest.experience;
    _job.businessFields = await getRepository(BusinessFieldEntity).find({
      where: {
        id:
          createJobRequest.businessFieldIds && createJobRequest.businessFieldIds.length != 0
            ? In(createJobRequest.businessFieldIds)
            : Not(IsNull()),
        name: createJobRequest.businessFieldIds.length == 0 ? 'Information Technology' : Not(IsNull()),
      },
    });

    _job.company = _currentCompany;
    _job.creator = _currentUser;
    await this.jobRepository.save(_job);

    return this.mapper.map(_job, JobDetail, JobEntity);
  }

  async updateJob(
    _currentUser: UserEntity,
    _currentCompany: CompanyEntity,
    updateJobParams: UpdateJobParams,
    updateJobRequest: UpdateJobRequest,
  ): Promise<JobDetail> {
    const _job = await this.jobRepository.findOne({
      where: { id: updateJobParams.jobId },
      relations: ['company', 'area', 'businessFields', 'skills'],
    });

    if (!_job) {
      throw new NotFoundException('Not found');
    }

    if (_currentCompany.id != _job.companyId) {
      throw new ForbiddenException('Forbidden Resource');
    }

    _job.maxEmployees = updateJobRequest.maxEmployees;
    _job.minEmployees = updateJobRequest.minEmployees;
    _job.description = updateJobRequest.description;
    _job.startDate = updateJobRequest.startDate;
    _job.workMode = updateJobRequest.workMode;
    _job.endDate = updateJobRequest.endDate;
    _job.salary = updateJobRequest.salary;
    _job.status = updateJobRequest.status;
    _job.title = updateJobRequest.title;
    _job.company = _currentCompany;

    _job.skills = await getRepository(SkillEntity).find({ where: { id: In(updateJobRequest.skillIds) } });

    _job.area =
      updateJobRequest.areaId == 0
        ? _currentCompany.area
        : await getRepository(AreaEntity).findOne({ id: updateJobRequest.areaId });

    _job.experience = updateJobRequest.experience;
    _job.businessFields = await getRepository(BusinessFieldEntity).find({
      where: {
        id:
          updateJobRequest.businessFieldIds && updateJobRequest.businessFieldIds.length != 0
            ? In(updateJobRequest.businessFieldIds)
            : Not(IsNull()),
        name: updateJobRequest.businessFieldIds.length == 0 ? 'Information Technology' : Not(IsNull()),
      },
    });

    _job.lastUpdater = _currentUser;
    _job.updatedAt = new Date();

    await this.jobRepository.save(_job);

    return this.mapper.map(_job, JobDetail, JobEntity);
  }

  async deleteJob(
    _currentUser: UserEntity,
    _currentCompany: CompanyEntity,
    deleteJobParams: DeleteJobParams,
  ): Promise<DeleteJobResponse> {
    const _job = await this.jobRepository.findOne({
      where: { id: deleteJobParams.jobId },
      relations: ['company', 'area', 'businessFields', 'skills'],
    });

    if (!_job) {
      throw new NotFoundException('Not found');
    }

    if (_currentCompany.id != _job.company.id) {
      throw new ForbiddenException('Forbidden Resource');
    }

    _job.lastUpdater = _currentUser;
    _job.deletedAt = new Date();
    _job.updatedAt = new Date();
    await this.jobRepository.save(_job);

    return {
      status: true,
    };
  }

  async applyOrReapplyJob(
    _currentUser: UserEntity,
    applyJobParams: ApplyJobParams,
    applyJobRequest: ApplyJobRequest,
  ): Promise<CandidateOfJob> {
    const _job = await this.jobRepository.findOne({ id: applyJobParams.jobId });

    if (!_job) {
      throw new NotFoundException('Not found');
    }

    let _jobCandidateRelation = await this.jobCandidateRepositoty.findOne({
      where: { jobId: applyJobParams.jobId, user: _currentUser },
      relations: ['user'],
      withDeleted: true,
    });

    if (
      _jobCandidateRelation &&
      (_jobCandidateRelation.applyStatus == JobApplyStatus.APPROVED ||
        _jobCandidateRelation.applyStatus == JobApplyStatus.WAITING)
    ) {
      throw new ForbiddenException('Already apply');
    }

    if (!_jobCandidateRelation) {
      _jobCandidateRelation = new JobCandidateRelation();
      _jobCandidateRelation.createdAt = new Date();
      _jobCandidateRelation.introduceMessage = applyJobRequest.introduceMessage;
      _jobCandidateRelation.updatedAt = _jobCandidateRelation.createdAt;
      _jobCandidateRelation.applyStatus = JobApplyStatus.WAITING;
      _jobCandidateRelation.user = _currentUser;
      _jobCandidateRelation.job = _job;
    } else if (_jobCandidateRelation) {
      if (_jobCandidateRelation.applyStatus == JobApplyStatus.REMOVED) {
        _jobCandidateRelation.createdAt = new Date();
        _jobCandidateRelation.deletedAt = null;
      }
      _jobCandidateRelation.introduceMessage = applyJobRequest.introduceMessage;
      _jobCandidateRelation.applyStatus = JobApplyStatus.WAITING;
      _jobCandidateRelation.updatedAt = new Date();
      _jobCandidateRelation.rejectMessage = null;
    }

    await this.jobCandidateRepositoty.save(_jobCandidateRelation);
    return this.mapper.map(_jobCandidateRelation, CandidateOfJob, JobCandidateRelation);
  }

  async getCandidatesOfJob(
    getCandidatesOfJobParams: GetCandidatesOfJobParams,
    getCandidatesOfJobQueries: GetCandidatesOfJobQuerires,
  ): Promise<GetCandidatesOfJobResponse> {
    const _job = await this.jobRepository.findOne({ id: getCandidatesOfJobParams.jobId });

    if (!_job) {
      throw new NotFoundException('Not found');
    }

    const records = getCandidatesOfJobQueries.records != undefined ? getCandidatesOfJobQueries.records : 10;

    let appliedAtBeginning = null;
    let appliedAtEnding = null;

    if (getCandidatesOfJobQueries.appliedAt != undefined) {
      let tempDate = new Date(getCandidatesOfJobQueries.appliedAt);
      appliedAtBeginning = new Date(tempDate.toDateString());
      appliedAtEnding = new Date(tempDate.setDate(appliedAtBeginning.getDate() + 1));
    }

    const [_jobCandidateRelations, totalRecods] = await this.jobCandidateRepositoty.findAndCount({
      where: {
        jobId: _job.id,
        user: {
          firstName:
            getCandidatesOfJobQueries.name != undefined ? Like(`%${getCandidatesOfJobQueries.name}%`) : Not(IsNull()),
        },
        applyStatus:
          getCandidatesOfJobQueries.applyStatus != undefined ? getCandidatesOfJobQueries.applyStatus : Not(IsNull()),
        createdAt:
          getCandidatesOfJobQueries.appliedAt != undefined
            ? Between(appliedAtBeginning, appliedAtEnding)
            : Not(IsNull()),
      },
      relations: ['user', 'editor'],
      skip: (getCandidatesOfJobQueries.page > 0 ? getCandidatesOfJobQueries.page - 1 : 0) * records,
      take: records,
      order: { createdAt: 'DESC' },
    });

    const totalEmployess = await this.jobEmployeeRepositoty.count({
      where: { jobId: _job.id, jobEmployeeStatus: JobEmployeeStatus.WORKING },
    });

    return {
      totalRecods: totalRecods,
      candidates: _jobCandidateRelations.map((_jobCandidateRelation) =>
        this.mapper.map(_jobCandidateRelation, CandidateOfJob, JobCandidateRelation),
      ),
      maxEmployees: _job.maxEmployees,
      totalEmployees: totalEmployess,
      jobStatus: _job.status,
    };
  }

  async approveOrRejectCandidateForJob(
    _currentUser: UserEntity,
    _currentCompany: CompanyEntity,
    changeJobApplyStatusParams: ChangeJobApplyStatusParams,
    changeJobApplyStatusRequest: ChangeJobApplyStatusRequest,
  ): Promise<CandidateOfJob> {
    const _jobCandidateRelation = await this.jobCandidateRepositoty.findOne({
      where: {
        jobId: changeJobApplyStatusParams.jobId,
        userId: changeJobApplyStatusParams.candidateId,
      },
      relations: ['job', 'job.company', 'user'],
    });

    if (!_jobCandidateRelation) {
      throw new NotFoundException('Not found');
    }

    if (_currentCompany.id != _jobCandidateRelation.job.companyId) {
      throw new ForbiddenException('Forbidden Resource');
    }

    _jobCandidateRelation.updatedAt = new Date();
    _jobCandidateRelation.editor = _currentUser;

    if (!['Reject', 'Approve'].includes(changeJobApplyStatusParams.changeJobApplyStatus)) {
      throw new BadRequestException('Bad Request');
    }

    if (_jobCandidateRelation.applyStatus != JobApplyStatus.WAITING) {
      throw new ForbiddenException('User has been rejected or approved');
    }

    if (changeJobApplyStatusParams.changeJobApplyStatus == 'Reject') {
      _jobCandidateRelation.applyStatus = JobApplyStatus.REJECTED;
      _jobCandidateRelation.rejectMessage = changeJobApplyStatusRequest.rejectMessage;
      await this.jobCandidateRepositoty.save(_jobCandidateRelation);
    } else if (changeJobApplyStatusParams.changeJobApplyStatus == 'Approve') {
      _jobCandidateRelation.applyStatus = JobApplyStatus.APPROVED;
      _jobCandidateRelation.rejectMessage = null;

      let _jobEmployeeRelation = await this.jobEmployeeRepositoty.findOne({
        where: { jobId: _jobCandidateRelation.job, userId: _jobCandidateRelation.userId },
      });

      if (_jobEmployeeRelation && _jobEmployeeRelation.jobEmployeeStatus != JobEmployeeStatus.REMOVED) {
        throw new ForbiddenException('User is an employee');
      }

      await getManager().transaction(async (transactionalEntityManager) => {
        if (!_jobEmployeeRelation) {
          _jobEmployeeRelation = new JobEmployeeRelation();
          _jobEmployeeRelation.user = _jobCandidateRelation.user;
          _jobEmployeeRelation.job = _jobCandidateRelation.job;
          _jobEmployeeRelation.createdAt = new Date();
        }
        _jobEmployeeRelation.jobEmployeeStatus = JobEmployeeStatus.WORKING;
        _jobEmployeeRelation.updatedAt = new Date();
        _jobEmployeeRelation.editor = _currentUser;

        await transactionalEntityManager.save(_jobEmployeeRelation);
        await transactionalEntityManager.save(_jobCandidateRelation);
      });
    }

    return this.mapper.map(_jobCandidateRelation, CandidateOfJob, JobCandidateRelation);
  }

  async removeEmployeeFromJob(
    _currentUser: UserEntity,
    _currentCompany: CompanyEntity,
    removeEmployeeFromJobParams: RemoveEmployeeFromJobParams,
  ): Promise<EmployeeOfJob> {
    const _job = await this.jobRepository.findOne({ id: removeEmployeeFromJobParams.jobId });

    const _jobEmployeeRelation = await this.jobEmployeeRepositoty.findOne({
      where: {
        userId: removeEmployeeFromJobParams.employeeId,
        jobId: removeEmployeeFromJobParams.jobId,
      },
      relations: ['user', 'job', 'job.company'],
    });

    if (!_job || !_jobEmployeeRelation) {
      throw new NotFoundException('Not found');
    }

    if (_jobEmployeeRelation.job.company.id != _currentCompany.id) {
      throw new ForbiddenException('Forbidden Resource');
    }

    if (_jobEmployeeRelation.jobEmployeeStatus == JobEmployeeStatus.REMOVED) {
      throw new ForbiddenException('Employee had been removed');
    }

    const _jobCandidateRelation = await this.jobCandidateRepositoty.findOne({
      where: { jobId: removeEmployeeFromJobParams.jobId, userId: removeEmployeeFromJobParams.employeeId },
    });

    await getManager().transaction(async (transactionalEntityManager) => {
      _jobCandidateRelation.rejectMessage = 'Got remove from job';
      _jobCandidateRelation.applyStatus = JobApplyStatus.REJECTED;
      _jobCandidateRelation.editor = _currentUser;

      _jobEmployeeRelation.jobEmployeeStatus = JobEmployeeStatus.REMOVED;
      _jobEmployeeRelation.updatedAt = new Date();
      _jobEmployeeRelation.editor = _currentUser;

      await transactionalEntityManager.save(_jobCandidateRelation);
      await transactionalEntityManager.save(_jobEmployeeRelation);
    });

    return this.mapper.map(_jobEmployeeRelation, EmployeeOfJob, JobEmployeeRelation);
  }

  async getEmployeesOfJob(
    getEmployeesOfJobParams: GetEmployeesOfJobParams,
    getEmployeesOfJobQueries: GetEmployeesOfJobQuerires,
  ): Promise<GetEmployeesOfJobResponse> {
    const _job = await this.jobRepository.findOne({ id: getEmployeesOfJobParams.jobId });

    if (!_job) {
      throw new NotFoundException('Not found');
    }

    const records = getEmployeesOfJobQueries.records != undefined ? getEmployeesOfJobQueries.records : 10;

    let appliedAtBeginning = null;
    let appliedAtEnding = null;

    if (getEmployeesOfJobQueries.joinedAt != undefined) {
      let tempDate = new Date(getEmployeesOfJobQueries.joinedAt);
      appliedAtBeginning = new Date(tempDate.toDateString());
      appliedAtEnding = new Date(tempDate.setDate(appliedAtBeginning.getDate() + 1));
    }

    const [_jobEmployeeRelations, totalRecods] = await this.jobEmployeeRepositoty.findAndCount({
      where: {
        jobId: _job.id,
        user: {
          firstName:
            getEmployeesOfJobQueries.name != undefined ? Like(`%${getEmployeesOfJobQueries.name}%`) : Not(IsNull()),
        },
        jobEmployeeStatus:
          getEmployeesOfJobQueries.jobEmployeeStatus != undefined
            ? getEmployeesOfJobQueries.jobEmployeeStatus
            : Not(IsNull()),
        createdAt:
          getEmployeesOfJobQueries.joinedAt != undefined ? Between(appliedAtBeginning, appliedAtEnding) : Not(IsNull()),
      },
      relations: ['user', 'editor'],
      skip: (getEmployeesOfJobQueries.page > 0 ? getEmployeesOfJobQueries.page - 1 : 0) * records,
      take: records,
      order: { createdAt: 'DESC' },
    });

    return {
      totalRecods: totalRecods,
      employees: _jobEmployeeRelations.map((_jobEmployeeRelation) =>
        this.mapper.map(_jobEmployeeRelation, EmployeeOfJob, JobEmployeeRelation),
      ),
      maxEmployees: _job.maxEmployees,
      totalEmployees: _jobEmployeeRelations.filter((er) => er.jobEmployeeStatus == JobEmployeeStatus.WORKING).length,
      jobStatus: _job.status,
    };
  }

  async completedJobByUser(
    _currentUser: UserEntity,
    completedJobByUserParams: CompletedJobByUserParams,
  ): Promise<EmployeeOfJob> {
    const _job = await this.jobRepository.findOne({ id: completedJobByUserParams.jobId });

    if (!_job) {
      throw new NotFoundException('Not found');
    }

    const _jobEmployeeRelation = await this.jobEmployeeRepositoty.findOne({
      where: { jobId: completedJobByUserParams.jobId, userId: _currentUser.id },
    });

    if (_job.status == JobStatus.DONE || _jobEmployeeRelation.jobEmployeeStatus == JobEmployeeStatus.DONE) {
      throw new ForbiddenException('Job is done');
    }

    if (_jobEmployeeRelation.jobEmployeeStatus == JobEmployeeStatus.REMOVED) {
      throw new ForbiddenException('No permission to change state');
    }

    if (_jobEmployeeRelation.jobEmployeeStatus == JobEmployeeStatus.COMPLETEDBYUSER) {
      throw new ForbiddenException('All ready completed');
    }

    _jobEmployeeRelation.jobEmployeeStatus = JobEmployeeStatus.COMPLETEDBYUSER;

    await this.jobEmployeeRepositoty.save(_jobEmployeeRelation);
    return this.mapper.map(_jobEmployeeRelation, EmployeeOfJob, JobEmployeeRelation);
  }

  async removeApplication(
    _currentUser: UserEntity,
    removeApplicationParams: RemoveApplicationParams,
  ): Promise<CandidateOfJob> {
    const _job = await this.jobRepository.findOne({ id: removeApplicationParams.jobId });

    const _jobCandidateRelation = await this.jobCandidateRepositoty.findOne({
      where: { jobId: removeApplicationParams.jobId, userId: _currentUser.id },
    });

    if (!_job || !_jobCandidateRelation) {
      throw new NotFoundException('Not found');
    }

    if (_jobCandidateRelation.applyStatus != JobApplyStatus.WAITING) {
      throw new ForbiddenException("Can't remove application");
    }

    _jobCandidateRelation.applyStatus = JobApplyStatus.REMOVED;
    _jobCandidateRelation.deletedAt = new Date();

    await this.jobCandidateRepositoty.save(_jobCandidateRelation);
    return this.mapper.map(_jobCandidateRelation, CandidateOfJob, JobCandidateRelation);
  }

  async changeEmployeeStatusJob(
    _currentUser: UserEntity,
    _currentCompany: CompanyEntity,
    changeEmployeeStatusJobParams: ChangeEmployeeStatusJobParams,
  ): Promise<EmployeeOfJob> {
    const _job = await this.jobRepository.findOne({ id: changeEmployeeStatusJobParams.jobId });

    const _jobEmployeeRelation = await this.jobEmployeeRepositoty.findOne({
      where: {
        userId: changeEmployeeStatusJobParams.employeeId,
        jobId: changeEmployeeStatusJobParams.jobId,
      },
      relations: ['user', 'job', 'job.company'],
    });

    if (!_job || !_jobEmployeeRelation) {
      throw new NotFoundException('Not found');
    }

    if (_jobEmployeeRelation.job.company.id != _currentCompany.id) {
      throw new ForbiddenException('Forbidden Resource');
    }

    if (_jobEmployeeRelation.jobEmployeeStatus == JobEmployeeStatus.REMOVED) {
      throw new ForbiddenException('Employee had been removed');
    }

    _jobEmployeeRelation.jobEmployeeStatus = changeEmployeeStatusJobParams.employeeStatus as JobEmployeeStatus;

    await this.jobEmployeeRepositoty.save(_jobEmployeeRelation);
    return this.mapper.map(_jobEmployeeRelation, EmployeeOfJob, JobEmployeeRelation);
  }

  async finishJob(
    _currentUser: UserEntity,
    _currentCompany: CompanyEntity,
    finishJobParams: FinishJobParams,
  ): Promise<FinishJobResponse> {
    const _job = await this.jobRepository.findOne({ id: finishJobParams.jobId });

    if (!_job) {
      throw new NotFoundException('Not found');
    }

    if (_job.companyId != _currentCompany.id) {
      throw new ForbiddenException('Forbidden Resource');
    }

    if (_job.status == JobStatus.DONE) {
      throw new ForbiddenException('Job is done');
    }

    if (_job.status == JobStatus.CANCEL) {
      throw new ForbiddenException('Job is cancelled');
    }

    await getManager().transaction(async (transactionalEntityManager) => {
      _job.status = JobStatus.DONE;

      const _jobEmployeeRelations = await this.jobEmployeeRepositoty.find({
        where: {
          jobId: finishJobParams.jobId,
          jobEmployeeStatus: In([JobEmployeeStatus.WORKING, JobEmployeeStatus.COMPLETEDBYUSER]),
        },
      });

      const salary = _job.salary;
      const totalEmployees = _jobEmployeeRelations.length;

      const employeeSalary = totalEmployees == 0 ? 0 : salary / totalEmployees;

      for (const _jobEmployeeRelation of _jobEmployeeRelations) {
        _jobEmployeeRelation.jobEmployeeStatus = JobEmployeeStatus.DONE;
        _jobEmployeeRelation.salary = employeeSalary;
        _jobEmployeeRelation.updatedAt = new Date();
      }

      await transactionalEntityManager.save(_job);
      await transactionalEntityManager.save(_jobEmployeeRelations);
    });

    return {
      status: true,
    };
  }
}
