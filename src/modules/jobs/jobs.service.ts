import { InjectMapper } from '@automapper/nestjs';
import type { Mapper } from '@automapper/types';
import { Injectable } from '@nestjs/common';
import { IsNull, Not, MoreThanOrEqual, In, getRepository } from 'typeorm';

import { JobRepository } from '@Repositories/job.repository';

import { JobBusinessFieldRelation } from '@Entities/job-business-field.relation';
import { BusinessFieldEntity } from '@Entities/business-field.entity';
import { JobSkillRelation } from '@Entities/job-skill.relation';
import { CompanyEntity } from '@Entities/company.entity';
import { SkillEntity } from '@Entities/skill.entity';
import { AreaEntity } from '@Entities/area.entity';
import { JobEntity } from '@Entities/job.entity';

import { JobExperience } from '@Shared/enums/job-experience';
import { JobWorkMode } from '@Shared/enums/job-work-mode';
import { JobStatus } from '@Shared/enums/job-status';

import { GetJobsQuery, GetJobDetailParam } from './dtos/requests';
import { GetJobsResponse, GetJobDetailResponse, JobDetail } from './dtos/responses';

import { Job } from '@Shared/responses/job';

@Injectable()
export class JobsService {
  constructor(
    @InjectMapper() private readonly mapper: Mapper,
    private jobRepository: JobRepository,
  ) {}

  async getJobs(getJobsQuery: GetJobsQuery): Promise<GetJobsResponse> {
    let jobIds: number[] = [];

    if (getJobsQuery.skillIds != undefined && getJobsQuery.skillIds.length != 0) {
      const jobIdsWithSkillIds = await getRepository(JobSkillRelation).find({
        where: { skillId: In(getJobsQuery.skillIds) }
      });
      jobIds = jobIdsWithSkillIds.map(r => r.jobId);
    }

    if (getJobsQuery.businessFieldIds != undefined && getJobsQuery.businessFieldIds.length != 0) {
      const jobIdsWithBusinessFieldIds = await getRepository(JobBusinessFieldRelation).find({
        where: {
          jobId: jobIds.length != 0 ? In(jobIds) : Not(IsNull()),
          businessFieldId: In(getJobsQuery.businessFieldIds)
        }
      });
      jobIds = jobIdsWithBusinessFieldIds.map(r => r.jobId);
    }

    const [_jobs, totalRecods] = await this.jobRepository.findAndCount({
      where: {
        id: jobIds.length != 0 ? In(jobIds) : Not(IsNull()),
        experience: getJobsQuery.experience != undefined ? getJobsQuery.experience : Not(IsNull()),
        workMode: getJobsQuery.workMode != undefined ? getJobsQuery.workMode : Not(IsNull()),
        salary: getJobsQuery.salary != undefined ? getJobsQuery.salary : MoreThanOrEqual(0),
        status: getJobsQuery.status != undefined ? getJobsQuery.status : Not(IsNull()),
        startDate: getJobsQuery.startDate != undefined ? getJobsQuery.startDate : Not(IsNull()),
        endDate: getJobsQuery.endDate != undefined ? getJobsQuery.endDate : Not(IsNull()),
        area: {
          id: getJobsQuery.areaId != undefined ? getJobsQuery.areaId : Not(IsNull())
        },
      },
      relations: ['area', 'skills', 'businessFields', 'company'],
      skip: getJobsQuery.page > 0 ? getJobsQuery.page - 1 : 0 * 10,
      take: 10,
      order: { createdAt: 'DESC'}
    });

    const response = new GetJobsResponse();
    response.totalRecords = totalRecods;
    response.jobs = _jobs.map(_job => this.mapper.map(_job, Job, JobEntity));
    return response;
  }

  async getJobDetail(getJobDetailParam: GetJobDetailParam): Promise<GetJobDetailResponse> {
    const _job = await this.jobRepository.findOne({
      where: { id: getJobDetailParam.jobId },
      relations: ['area', 'skills', 'businessFields', 'company'],
    });

    const response = new GetJobDetailResponse();
    response.jobDetail = this.mapper.map(_job, JobDetail, JobEntity);
    response.relatedJobs = [];
    return response;
  }

}
