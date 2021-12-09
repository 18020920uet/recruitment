import { IsNull, Not, In, getManager, getRepository, Like, Between, MoreThan } from 'typeorm';
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectMapper } from '@automapper/nestjs';
// import { ConfigService } from '@nestjs/config';
import type { Mapper } from '@automapper/types';

import { CurriculumVitaeSkillRelation } from '@Entities/curriculum-vitae-skill.relation';
import { CurriculumVitaeEntity } from '@Entities/curriculum-vitae.entity';

import { CurriculumVitaeRepository } from '@Repositories/curriculum-vitae.repository';
import { JobCandidateRepositoty } from '@Repositories/job-candidate.repository';
import { JobEmployeeRepositoty } from '@Repositories/job-employee.repository';
import { UserRepository } from '@Repositories/user.repository';

import { CurriculumVitae } from '@Shared/responses/curriculum-vitae';

import { JobApplyStatus } from '@Shared/enums/job-apply-status';
import { JobStatus } from '@Shared/enums/job-status';

import { GetUserProfileParams, GetJobsOfUserQueries, GetJobsOfUserParams, GetUsersQuery } from './dtos/requests';
import {
  GetUserProfileResponse,
  GetJobsOfUserResponse,
  GetUsersResponse,
  FreeLancer,
  JobOfUser,
} from './dtos/responses';

@Injectable()
export class UsersService {
  constructor(
    @InjectMapper() private readonly mapper: Mapper,
    private curriculumVitaeRepository: CurriculumVitaeRepository,
    private jobCandidateRepositoty: JobCandidateRepositoty,
    private jobEmployeeRepositoty: JobEmployeeRepositoty,
    private userRepository: UserRepository,
  ) {}

  async getUsers(getUsersQuery: GetUsersQuery): Promise<GetUsersResponse> {
    let _cvIds: number[] = [];
    let forceQuery = false;

    if (
      (getUsersQuery.skillIds != undefined && getUsersQuery.skillIds.length != 0) ||
      (getUsersQuery.languageIds != undefined && getUsersQuery.languageIds.length != 0) ||
      getUsersQuery.experience != undefined
    ) {
      forceQuery = true;
    }

    const _curriculumVitaeSkillRelations = await getRepository(CurriculumVitaeSkillRelation).find({
      where: {
        skillId:
          getUsersQuery.skillIds != undefined && getUsersQuery.skillIds.length != 0
            ? In(getUsersQuery.skillIds)
            : Not(IsNull()),
        experience: getUsersQuery.experience != undefined ? getUsersQuery.experience : IsNull(),
      },
    });

    _cvIds = [...new Set(_curriculumVitaeSkillRelations.map((_cvsr) => _cvsr.cvId))];

    if (getUsersQuery.languageIds != undefined && getUsersQuery.languageIds.length != 0) {
      let queryString = '';
      const params = getUsersQuery.languageIds.map((languageId) => `'${languageId}'`).join(',');

      if (
        getUsersQuery.skillIds != undefined &&
        getUsersQuery.skillIds.length != 0 &&
        getUsersQuery.experience != undefined
      ) {
        queryString = `SELECT cv_id FROM "curriculum_vitaes_languages" WHERE language_id IN (${params}) GROUP BY cv_id, language_id`;
      } else {
        if (_cvIds.length != 0) {
          queryString =
            `SELECT cv_id FROM "curriculum_vitaes_languages" WHERE language_id IN (${params}) ` +
            `AND cv_id IN (${_cvIds.map((cvId) => `'${cvId}'`).join(',')}) GROUP BY cv_id, language_id`;
        }
      }

      if (queryString != '') {
        _cvIds = (await getManager().query(queryString)).map((r: { cv_id: number }) => r['cv_id']);
      }
    }

    const records = getUsersQuery.records != undefined ? getUsersQuery.records : 10;

    const [_curriculumVitaes, totalRecords] = await this.curriculumVitaeRepository.findAndCount({
      relations: ['user', 'languages', 'nationality', 'area', 'country', 'skillRelations', 'skillRelations.skill'],
      where: {
        id: forceQuery ? In(_cvIds) : Not(IsNull()),
        user: {
          firstName: getUsersQuery.name != undefined ? Like(`%${getUsersQuery.name}%`) : Not(IsNull()),
          // lastName: getUsersQuery.name != undefined ? Like(`%${getUsersQuery.name}%`) : Not(IsNull()),
          role: getUsersQuery.role != undefined ? getUsersQuery.role : 2,
        },
        areaId: getUsersQuery.areaId != undefined ? getUsersQuery.areaId : Not(IsNull()),
        rate:
          getUsersQuery.rate != undefined
            ? Between(Math.floor(getUsersQuery.rate), Math.floor(getUsersQuery.rate) + 1)
            : Not(IsNull()),
      },
      order: { createdAt: 'DESC' },
      skip: (getUsersQuery.page > 0 ? getUsersQuery.page - 1 : 0) * records,
      take: records,
    });

    const response = new GetUsersResponse();
    response.totalRecords = totalRecords;
    response.users = _curriculumVitaes.map((_cv) => this.mapper.map(_cv, FreeLancer, CurriculumVitaeEntity));
    return response;
  }

  async getUserProfile(getUserProfileParams: GetUserProfileParams): Promise<GetUserProfileResponse> {
    const userId = getUserProfileParams.userId;

    const response: GetUserProfileResponse = new GetUserProfileResponse();
    response.cv = await this.getCurriculumVitae(userId);
    response.reviews = [];
    response.jobs = [];
    response.jobsAnalysis = null;
    return response;
  }

  async getCurriculumVitae(userId: string): Promise<CurriculumVitae> {
    const _cv = await this.curriculumVitaeRepository.findOne({
      where: { userId: userId },
      relations: [
        'skillRelations.skill',
        'skillRelations',
        'experiences',
        'nationality',
        'languages',
        'country',
        'user',
        'area',
      ],
    });
    return this.mapper.map(_cv, CurriculumVitae, CurriculumVitaeEntity);
  }

  async getJobsOfUser(
    getJobsOfUserParams: GetJobsOfUserParams,
    getJobsOfUserQueries: GetJobsOfUserQueries,
  ): Promise<GetJobsOfUserResponse> {
    if (getJobsOfUserQueries.jobStatuses != undefined && getJobsOfUserQueries.jobStatuses.length != 0) {
      for (const jobStatus of getJobsOfUserQueries.jobStatuses) {
        if (!['Inprogress', 'Pending', 'Await', 'Cancel', 'Done'].includes(jobStatus)) {
          throw new BadRequestException('Unknown Job Status');
        }
      }
    }

    const _user = await this.userRepository.findOne({ id: getJobsOfUserParams.userId });

    if (!_user) {
      throw new NotFoundException("Can't find user");
    }

    switch (getJobsOfUserParams.type) {
      case 'applied': {
        const records = getJobsOfUserQueries.records != undefined ? getJobsOfUserQueries.records : 10;

        const [_appliedJobs, totalRecords] = await this.jobCandidateRepositoty.findAndCount({
          relations: ['job', 'user'],
          where: {
            userId: getJobsOfUserParams.userId,
            createdAt:
              getJobsOfUserQueries.appliedFrom != undefined
                ? MoreThan(getJobsOfUserQueries.appliedFrom)
                : Not(IsNull()),
            job: {
              title:
                getJobsOfUserQueries.jobTitle != undefined ? Like(`%${getJobsOfUserQueries.jobTitle}%`) : Not(IsNull()),
              status:
                getJobsOfUserQueries.jobStatuses != undefined && getJobsOfUserQueries.jobStatuses.length != 0
                  ? In(getJobsOfUserQueries.jobStatuses)
                  : Not(IsNull()),
            },
          },
          order: { createdAt: getJobsOfUserQueries.appliedFrom != undefined ? 'ASC' : 'DESC' },
          skip: (getJobsOfUserQueries.page > 0 ? getJobsOfUserQueries.page - 1 : 0) * records,
          take: records,
        });

        return {
          jobsOfUser: _appliedJobs.map((_appliedJob) => {
            const jobOfUser = new JobOfUser();
            jobOfUser.isFinished = _appliedJob.job.status == JobStatus.DONE ? true : false;
            jobOfUser.isJoined = _appliedJob.applyStatus == JobApplyStatus.APPROVED ? true : false;
            jobOfUser.rejectMessage = _appliedJob.rejectMessage;
            jobOfUser.jobApplyStatus = _appliedJob.applyStatus;
            jobOfUser.jobStatus = _appliedJob.job.status;
            jobOfUser.appliedAt = _appliedJob.createdAt;
            jobOfUser.jobName = _appliedJob.job.title;
            jobOfUser.jobId = _appliedJob.job.id;
            jobOfUser.jobEmployeeStatus = null;
            jobOfUser.joinedAt = null;
            jobOfUser.salary = 0;
            return jobOfUser;
          }),
          totalRecords: totalRecords,
        };
      }
      case 'joined': {
        const records = getJobsOfUserQueries.records != undefined ? getJobsOfUserQueries.records : 10;
        const [_joinedJobs, totalRecords] = await this.jobEmployeeRepositoty.findAndCount({
          relations: ['job', 'user'],
          where: {
            userId: getJobsOfUserParams.userId,
            createdAt:
              getJobsOfUserQueries.joinedFrom != undefined ? MoreThan(getJobsOfUserQueries.joinedFrom) : Not(IsNull()),
            job: {
              title:
                getJobsOfUserQueries.jobTitle != undefined ? Like(`%${getJobsOfUserQueries.jobTitle}%`) : Not(IsNull()),
              status:
                getJobsOfUserQueries.jobStatuses != undefined && getJobsOfUserQueries.jobStatuses.length != 0
                  ? In(getJobsOfUserQueries.jobStatuses)
                  : Not(IsNull()),
            },
          },
          order: { createdAt: getJobsOfUserQueries.joinedFrom != undefined ? 'ASC' : 'DESC' },
          skip: (getJobsOfUserQueries.page > 0 ? getJobsOfUserQueries.page - 1 : 0) * records,
          take: records,
        });

        return {
          jobsOfUser: _joinedJobs.map((_joinedJob) => {
            const jobOfUser = new JobOfUser();
            jobOfUser.isFinished = _joinedJob.job.status == JobStatus.DONE ? true : false;
            jobOfUser.jobEmployeeStatus = _joinedJob.jobEmployeeStatus;
            jobOfUser.jobStatus = _joinedJob.job.status;
            jobOfUser.joinedAt = _joinedJob.createdAt;
            jobOfUser.jobName = _joinedJob.job.title;
            jobOfUser.jobId = _joinedJob.job.id;
            jobOfUser.salary = _joinedJob.salary;
            jobOfUser.jobApplyStatus = null;
            jobOfUser.rejectMessage = null;
            jobOfUser.appliedAt = null;
            jobOfUser.isJoined = true;
            return jobOfUser;
          }),
          totalRecords: totalRecords,
        };
      }
      default: {
        throw new BadRequestException('Unknown type');
      }
    }
  }
}
