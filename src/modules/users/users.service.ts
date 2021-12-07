import { IsNull, Not, In, getManager, getRepository, Like, Between, MoreThan } from 'typeorm';
import { Injectable, ForbiddenException, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectMapper } from '@automapper/nestjs';
// import { ConfigService } from '@nestjs/config';
import type { Mapper } from '@automapper/types';

import { CurriculumVitaeSkillRelation } from '@Entities/curriculum-vitae-skill.relation';
import { CurriculumVitaeEntity } from '@Entities/curriculum-vitae.entity';
import { ReviewEntity } from '@Entities/review.entity';
import { UserEntity } from '@Entities/user.entity';

import { CurriculumVitaeRepository } from '@Repositories/curriculum-vitae.repository';
import { JobCandidateRepositoty } from '@Repositories/job-candidate.repository';
import { JobEmployeeRepositoty } from '@Repositories/job-employee.repository';
import { ReviewRepository } from '@Repositories/review.repository';
import { UserRepository } from '@Repositories/user.repository';

import { CurriculumVitae } from '@Shared/responses/curriculum-vitae';
import { ReviewByUser } from '@Shared/responses/review-by-user';
import { Review } from '@Shared/responses/review';

import { JobApplyStatus } from '@Shared/enums/job-apply-status';
import { JobStatus } from '@Shared/enums/job-status';

import {
  GetUserProfileParams,
  GetJobsOfUserQueries,
  CreateReviewRequest,
  UpdateReviewRequest,
  GetJobsOfUserParams,
  UpdateReviewParams,
  DeleteReviewParams,
  CreateReviewParam,
  GetUsersQuery,
} from './dtos/requests';
import {
  GetUserProfileResponse,
  GetJobsOfUserResponse,
  DeleteReviewResponse,
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
    private reviewRepository: ReviewRepository,
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

  async getReviews(userId: string, page: number): Promise<Review[]> {
    const _reviews = await this.reviewRepository.find({
      where: { revieweeId: userId },
      relations: ['reviewer'],
      order: { createdAt: 'ASC' },
      skip: page > 0 ? page - 1 : 0 * 10,
      take: 10,
    });
    return _reviews.map((_review) => this.mapper.map(_review, Review, ReviewEntity));
  }

  async getReviewsByUser(userId: string, page: number): Promise<ReviewByUser[]> {
    const _reviews = await this.reviewRepository.find({
      where: { reviewerId: userId },
      relations: ['reviewee'],
      order: { createdAt: 'ASC' },
      skip: page > 0 ? page - 1 : 0 * 10,
      take: 10,
    });
    return _reviews.map((_review) => this.mapper.map(_review, ReviewByUser, ReviewEntity));
  }

  async createReview(
    _currentUser: UserEntity,
    createReviewParam: CreateReviewParam,
    createReviewRequest: CreateReviewRequest,
  ): Promise<Review> {
    const _user = await this.userRepository.findOne({ id: createReviewParam.userId });

    if (!_user) {
      throw new NotFoundException("Can't find user");
    }

    const _review = new ReviewEntity();
    _review.rate = createReviewRequest.rate;
    _review.comment = createReviewRequest.comment;
    _review.reviewer = _currentUser;
    _review.reviewee = _user;

    await this.reviewRepository.save(_review);
    return this.mapper.map(_review, Review, ReviewEntity);
  }

  async updateReview(
    _currentUser: UserEntity,
    updateReviewParams: UpdateReviewParams,
    updateReviewRequest: UpdateReviewRequest,
  ): Promise<Review> {
    const _user = await this.userRepository.findOne({ id: updateReviewParams.userId });

    if (!_user) {
      throw new NotFoundException('Cannot find user');
    }

    const _review = await this.reviewRepository.findOne({
      where: { id: updateReviewParams.reviewId },
      relations: ['reviewer'],
    });

    if (!_review) {
      throw new NotFoundException('Cannot find review');
    }

    if (_review.reviewerId != _currentUser.id) {
      throw new ForbiddenException('No permission to edit');
    }

    _review.rate = updateReviewRequest.rate;
    _review.comment = updateReviewRequest.comment;

    await this.reviewRepository.save(_review);
    return this.mapper.map(_review, Review, ReviewEntity);
  }

  async deleteReview(_currentUser: UserEntity, deleteReviewParams: DeleteReviewParams): Promise<DeleteReviewResponse> {
    const _user = await this.userRepository.findOne({ id: deleteReviewParams.userId });

    if (!_user) {
      throw new NotFoundException('Cannot find user');
    }

    const _review = await this.reviewRepository.findOne({ id: deleteReviewParams.reviewId });

    if (!_review) {
      throw new NotFoundException('Cannot find review');
    }

    if (_review.reviewerId != _currentUser.id) {
      throw new ForbiddenException('No permission to delete');
    }

    await this.reviewRepository.remove(_review);
    return {
      status: true,
    };
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

        const [appliedJobs, totalRecords] = await this.jobCandidateRepositoty.findAndCount({
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
          jobsOfUser: appliedJobs.map((appliedJob) => {
            const jobOfUser = new JobOfUser();
            jobOfUser.isFinished = appliedJob.job.status == JobStatus.DONE ? true : false;
            jobOfUser.isJoined = appliedJob.applyStatus == JobApplyStatus.APPROVED ? true : false;
            jobOfUser.jobApplyStatus = appliedJob.applyStatus;
            jobOfUser.rejectMessage = appliedJob.rejectMessage;
            jobOfUser.jobStatus = appliedJob.job.status;
            jobOfUser.appliedAt = appliedJob.createdAt;
            jobOfUser.jobName = appliedJob.job.title;
            jobOfUser.jobId = appliedJob.job.id;
            jobOfUser.jobEmployeeStatus = null;
            jobOfUser.joinedAt = null;
            return jobOfUser;
          }),
          totalRecords: totalRecords,
        };
      }
      case 'joined': {
        const records = getJobsOfUserQueries.records != undefined ? getJobsOfUserQueries.records : 10;
        const [joinedJobs, totalRecords] = await this.jobEmployeeRepositoty.findAndCount({
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
          jobsOfUser: joinedJobs.map((joinedJob) => {
            const jobOfUser = new JobOfUser();
            jobOfUser.isFinished = joinedJob.job.status == JobStatus.DONE ? true : false;
            jobOfUser.jobEmployeeStatus = joinedJob.jobEmployeeStatus;
            jobOfUser.jobStatus = joinedJob.job.status;
            jobOfUser.joinedAt = joinedJob.createdAt;
            jobOfUser.jobName = joinedJob.job.title;
            jobOfUser.jobId = joinedJob.job.id;
            jobOfUser.jobApplyStatus = null;
            jobOfUser.rejectMessage = null;
            jobOfUser.isJoined = true;
            jobOfUser.appliedAt = null;

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
