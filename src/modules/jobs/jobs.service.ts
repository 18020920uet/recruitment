import { InjectMapper } from '@automapper/nestjs';
import type { Mapper } from '@automapper/types';
import { Injectable } from '@nestjs/common';
import { IsNull, Not, MoreThanOrEqual, In, getManager, getRepository, createQueryBuilder, Like } from 'typeorm';

import { JobRepository } from '@Repositories/job.repository';

import { BusinessFieldEntity } from '@Entities/business-field.entity';
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

import { RelatedJobFilter } from '@Shared/enums/related-job-filter';

@Injectable()
export class JobsService {
  constructor(@InjectMapper() private readonly mapper: Mapper, private jobRepository: JobRepository) {}

  async getJobs(getJobsQuery: GetJobsQuery): Promise<GetJobsResponse> {
    let jobIds: number[] = [];

    if (getJobsQuery.skillIds != undefined && getJobsQuery.skillIds.length != 0) {
      const skillIds = getJobsQuery.skillIds;
      const params = skillIds.map((skillId) => `${skillId}`).join(',');
      const queryString = `SELECT * FROM "jobs_skills" WHERE skill_id IN (${params}) GROUP BY job_id, skill_id`;
      jobIds = (await getManager().query(queryString)).map((r) => r['job_id']);
    }

    if (getJobsQuery.businessFieldIds != undefined && getJobsQuery.businessFieldIds.length != 0) {
      const businessFieldIds = getJobsQuery.businessFieldIds;
      const params = businessFieldIds.map((businessFieldId) => `${businessFieldId}`).join(',');
      const params2 = jobIds.map((jobId) => `${jobId}`).join(',');
      const queryString =
        `SELECT * FROM "jobs_business_fields" WHERE business_field_id IN (${params})` +
        `AND job_id IN (${params2}) GROUP BY job_id, business_field_id`;
      jobIds = (await getManager().query(queryString)).map((r) => r['job_id']);
    }

    if (getJobsQuery.title != undefined) {
      const title = getJobsQuery.title;
      if (!title.includes("')") && !title.includes('")')) {
        const params = jobIds.map((jobId) => `${jobId}`).join(',');
        jobIds = (
          await getRepository(JobEntity)
            .createQueryBuilder('job')
            .where((jobIds.length != 0 ? `id IN (${params}) AND ` : '') + `title @@ to_tsquery('${title}')`)
            .select('job.id')
            .getMany()
        ).map((_job) => _job.id);
      }
    }

    const records = getJobsQuery.records != undefined ? getJobsQuery.records : 10;

    const [_jobs, totalRecods] = await this.jobRepository.findAndCount({
      where: {
        id: jobIds.length != 0 ? In(jobIds) : Not(IsNull()),
        experience: getJobsQuery.experience != undefined ? getJobsQuery.experience : Not(IsNull()),
        title: getJobsQuery.title != undefined ? Like(`%${getJobsQuery.title}%`) : Not(IsNull()),
        startDate: getJobsQuery.startDate != undefined ? getJobsQuery.startDate : Not(IsNull()),
        workMode: getJobsQuery.workMode != undefined ? getJobsQuery.workMode : Not(IsNull()),
        salary: getJobsQuery.salary != undefined ? getJobsQuery.salary : MoreThanOrEqual(0),
        endDate: getJobsQuery.endDate != undefined ? getJobsQuery.endDate : Not(IsNull()),
        status: getJobsQuery.status != undefined ? getJobsQuery.status : Not(IsNull()),
        area: {
          id: getJobsQuery.areaId != undefined ? getJobsQuery.areaId : Not(IsNull()),
        },
      },
      relations: ['area', 'skills', 'businessFields', 'company'],
      skip: getJobsQuery.page > 0 ? getJobsQuery.page - 1 : 0 * records,
      take: records,
      order: { createdAt: 'DESC' },
    });

    const response = new GetJobsResponse();
    response.totalRecords = totalRecods;
    response.jobs = _jobs.map((_job) => this.mapper.map(_job, Job, JobEntity));
    return response;
  }

  async getJobDetail(getJobDetailParam: GetJobDetailParam): Promise<GetJobDetailResponse> {
    const _job = await this.jobRepository.findOne({
      where: { id: getJobDetailParam.jobId },
      relations: ['area', 'skills', 'businessFields', 'company'],
    });

    const response = new GetJobDetailResponse();
    response.jobDetail = this.mapper.map(_job, JobDetail, JobEntity);

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
        const params = businessFieldIds.map((id, index) => `$${index + 1}`).join(',');
        const query =
          `SELECT * FROM "jobs_business_fields" WHERE business_field_id IN (${params})` +
          'GROUP BY job_id, business_field_id';
        const jobIds = (await getManager().query(query, businessFieldIds)).map((r) => r['job_id']);
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
        const query = `SELECT * FROM "jobs_skills" WHERE skill_id IN (${params}) GROUP BY job_id, skill_id`;
        const jobIds = (await getManager().query(query)).map((r) => r['job_id']);
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

    response.relatedJobs = _relatedJobs.map((_relatedJob) => this.mapper.map(_relatedJob, Job, JobEntity));
    return response;
  }
}
