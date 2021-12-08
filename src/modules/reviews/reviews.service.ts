import { Between, getManager, IsNull, LessThanOrEqual, MoreThanOrEqual, Not } from 'typeorm';
import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/types';

import { ReviewEntity } from '@Entities/review.entity';
import { UserEntity } from '@Entities/user.entity';

import { JobEmployeeRepositoty } from '@Repositories/job-employee.repository';
import { CompanyRepository } from '@Repositories/company.repository';
import { ReviewRepository } from '@Repositories/review.repository';
import { UserRepository } from '@Repositories/user.repository';
import { JobRepository } from '@Repositories/job.repository';

import { Review } from '@Shared/responses/review';

import {
  CreateReviewOfJobFromCompanyParams,
  CreateReviewOfJobFromCompanyRequest,
  CreateReviewOfJobFromUserParams,
  CreateReviewOfJobFromUserRequest,
  GetReviewsOfCompanyParams,
  GetReviewsOfUserParams,
  GetReviewsOfJobParams,
  UpdateReviewRequest,
  DeleteReviewParams,
  UpdateReviewParams,
  GetReviewsQueries,
  GetReviewParams,
} from './dtos/requests';
import { ReviewBy } from '@Shared/enums/review-by';
import { JobStatus } from '@Shared/enums/job-status';
import { CompanyEntity } from '@Entities/company.entity';

import { GetReviewsResponse } from './dtos/responses';

// import { CreateReviewParam, CreateReviewRequest, UpdateReviewParams } from './dtos/requests';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectMapper() private readonly mapper: Mapper,
    private jobEmployeeRepository: JobEmployeeRepositoty,
    private companyRepository: CompanyRepository,
    private reviewRepository: ReviewRepository,
    private userRepository: UserRepository,
    private jobRepository: JobRepository,
  ) {}

  async createReviewOfJobFromUser(
    _currentUser: UserEntity,
    createReviewForJobFromUserParams: CreateReviewOfJobFromUserParams,
    createReviewOfJobFromUserRequest: CreateReviewOfJobFromUserRequest,
  ): Promise<Review> {
    const _job = await this.jobRepository.findOne({
      where: { id: createReviewForJobFromUserParams.jobId },
      relations: ['company'],
    });

    if (!_job) {
      throw new NotFoundException("Can't find job");
    }

    const _jobEmployeeRelation = await this.jobEmployeeRepository.findOne({ userId: _currentUser.id, jobId: _job.id });

    if (!_jobEmployeeRelation) {
      throw new ForbiddenException("You are not this job's employee");
    }

    if (_job.status != JobStatus.DONE) {
      throw new ForbiddenException('This job is not completed yet');
    }

    const _review = new ReviewEntity();
    _review.comment = createReviewOfJobFromUserRequest.comment;
    _review.rate = createReviewOfJobFromUserRequest.rate;
    _review.reviewBy = ReviewBy.FREELANCE;
    _review.reviewer = _currentUser;
    _review.createdAt = new Date();
    _review.updatedAt = null;
    _review.deletedAt = null;
    _review.reviewee = null;
    _review.job = _job;

    // Cập nhật điểm
    _job.company.reviewPoint += _review.rate;
    _job.company.totalReviews += 1;

    _jobEmployeeRelation.wroteReview = true;

    await getManager().transaction(async (transactionalEntityManager) => {
      await transactionalEntityManager.save(_jobEmployeeRelation);
      await transactionalEntityManager.save(_job.company);
      await transactionalEntityManager.save(_review);
    });

    return this.mapper.map(_review, Review, ReviewEntity);
  }

  async updateReviewOfJobFromUser(
    _currentUser: UserEntity,
    updateReviewParams: UpdateReviewParams,
    updateReviewRequest: UpdateReviewRequest,
  ): Promise<Review> {
    const _review = await this.reviewRepository.findOne({
      where: { id: updateReviewParams.reviewId },
      relations: ['reviewer', 'reviewee', 'job', 'job.company'],
    });

    if (!_review) {
      throw new NotFoundException('Cannot find review');
    }

    if (_review.reviewerId != _currentUser.id) {
      throw new ForbiddenException('No permission to edit');
    }

    const oldRate = _review.rate;
    _review.rate = updateReviewRequest.rate;
    _review.comment = updateReviewRequest.comment;

    // Cập nhật điểm
    _review.job.company.reviewPoint = _review.job.company.reviewPoint - oldRate + _review.rate;

    await getManager().transaction(async (transactionalEntityManager) => {
      await transactionalEntityManager.save(_review.job.company);
      await transactionalEntityManager.save(_review);
    });

    return this.mapper.map(_review, Review, ReviewEntity);
  }

  async deleteReviewOfJobFromUser(_currentUser: UserEntity, deleteReviewParams: DeleteReviewParams): Promise<Review> {
    const _review = await this.reviewRepository.findOne({
      where: { id: deleteReviewParams.reviewId },
      relations: ['reviewer', 'reviewee', 'job', 'job.company'],
    });

    if (!_review) {
      throw new NotFoundException('Cannot find review of job');
    }

    if (_review.reviewerId != _currentUser.id) {
      throw new ForbiddenException('No permission to delete');
    }

    _review.deletedAt = new Date();

    _review.job.company.reviewPoint = _review.job.company.reviewPoint - _review.rate;
    _review.job.company.totalReviews -= 1;

    const _jobEmployeeRelation = await this.jobEmployeeRepository.findOne({
      userId: _currentUser.id,
      jobId: _review.job.id,
    });

    _jobEmployeeRelation.wroteReview = false;

    await getManager().transaction(async (transactionalEntityManager) => {
      await transactionalEntityManager.save(_jobEmployeeRelation);
      await transactionalEntityManager.save(_review.job.company);
      await transactionalEntityManager.save(_review);
    });

    return this.mapper.map(_review, Review, ReviewEntity);
  }

  async createReviewOfJobFromCompany(
    _currentUser: UserEntity,
    _currentCompany: CompanyEntity,
    createReviewOfJobFromCompanyParams: CreateReviewOfJobFromCompanyParams,
    createReviewOfJobFromCompanyRequest: CreateReviewOfJobFromCompanyRequest,
  ): Promise<Review> {
    const _job = await this.jobRepository.findOne({
      where: { id: createReviewOfJobFromCompanyParams.jobId },
      relations: ['company'],
    });

    if (!_job) {
      throw new NotFoundException("Can't find job");
    }

    const _user = await this.userRepository.findOne({ id: createReviewOfJobFromCompanyParams.userId });

    if (!_user) {
      throw new NotFoundException("Can't find user");
    }

    if (_job.company.id != _currentCompany.id) {
      throw new ForbiddenException('No permission to write review');
    }

    if (_job.status != JobStatus.DONE) {
      throw new ForbiddenException('This job is not completed yet');
    }

    const _jobEmployeeRelation = await this.jobEmployeeRepository.findOne({
      where: {
        userId: createReviewOfJobFromCompanyParams.userId,
        jobId: _job.id,
      },
      relations: ['user'],
    });

    if (!_jobEmployeeRelation) {
      throw new ForbiddenException('User are not employee of this job');
    }

    const _review = new ReviewEntity();
    _review.comment = createReviewOfJobFromCompanyRequest.comment;
    _review.rate = createReviewOfJobFromCompanyRequest.rate;
    _review.reviewee = _user;
    _review.reviewBy = ReviewBy.COMPANY;
    _review.reviewer = _currentUser;
    _review.createdAt = new Date();
    _review.updatedAt = null;
    _review.deletedAt = null;
    _review.job = _job;

    _user.reviewPoint += _review.rate;
    _user.totalReviews += 1;

    _jobEmployeeRelation.hasBeenReview = true;

    await getManager().transaction(async (transactionalEntityManager) => {
      await transactionalEntityManager.save(_jobEmployeeRelation);
      await transactionalEntityManager.save(_user);
      await transactionalEntityManager.save(_review);
    });

    return this.mapper.map(_review, Review, ReviewEntity);
  }

  async updateReviewOfJobFromCompany(
    _currentUser: UserEntity,
    _currentCompany: CompanyEntity,
    updateReviewParams: UpdateReviewParams,
    updateReviewRequest: UpdateReviewRequest,
  ): Promise<Review> {
    const _review = await this.reviewRepository.findOne({
      where: { id: updateReviewParams.reviewId },
      relations: ['reviewer', 'reviewee', 'job', 'job.company'],
    });

    if (!_review) {
      throw new NotFoundException("Can't find review");
    }

    if (_review.job.company.id != _currentCompany.id) {
      throw new ForbiddenException('No permission to write review');
    }

    const oldPoint = _review.rate;

    _review.comment = updateReviewRequest.comment;
    _review.rate = updateReviewRequest.rate;
    _review.reviewer = _currentUser;
    _review.updatedAt = new Date();

    // Cập nhật điểm
    _review.reviewee.reviewPoint = _review.reviewee.reviewPoint - oldPoint + _review.rate;

    const _jobEmployeeRelation = await this.jobEmployeeRepository.findOne({
      where: { userId: _review.reviewee.id, jobId: _review.job.id },
      relations: ['user'],
    });

    _jobEmployeeRelation.hasBeenReview = false;

    await getManager().transaction(async (transactionalEntityManager) => {
      await transactionalEntityManager.save(_jobEmployeeRelation);
      await transactionalEntityManager.save(_review.reviewee);
      await transactionalEntityManager.save(_review);
    });

    return this.mapper.map(_review, Review, ReviewEntity);
  }

  async deleteReviewOfJobFromCompany(
    _currentUser: UserEntity,
    _currentCompany: CompanyEntity,
    deleteReviewParams: DeleteReviewParams,
  ): Promise<Review> {
    const _review = await this.reviewRepository.findOne({
      where: { id: deleteReviewParams.reviewId },
      relations: ['reviewer', 'reviewee', 'job', 'job.company'],
    });

    if (!_review) {
      throw new NotFoundException("Can't find review");
    }

    if (_review.job.company.id != _currentCompany.id) {
      throw new ForbiddenException('No permission to write review');
    }

    _review.deletedAt = new Date();

    _review.reviewee.reviewPoint = _review.reviewee.reviewPoint - _review.rate;
    _review.reviewee.totalReviews -= 1;

    await getManager().transaction(async (transactionalEntityManager) => {
      await transactionalEntityManager.save(_review.reviewee);
      await transactionalEntityManager.save(_review);
    });

    return this.mapper.map(_review, Review, ReviewEntity);
  }

  async getReviewsOfJob(
    getReviewsOfJobParams: GetReviewsOfJobParams,
    getReviewsQueries: GetReviewsQueries,
  ): Promise<GetReviewsResponse> {
    const _job = await this.jobRepository.findOne({
      where: { id: getReviewsOfJobParams.jobId },
    });

    if (!_job) {
      throw new NotFoundException("Can't find job");
    }

    const records = getReviewsQueries.records != undefined ? getReviewsQueries.records : 10;
    const [_reviews, totalRecords] = await this.reviewRepository.findAndCount({
      where: {
        jobId: getReviewsOfJobParams.jobId,
        reviewBy:
          getReviewsOfJobParams.type == 'byUser'
            ? ReviewBy.FREELANCE
            : getReviewsOfJobParams.type == 'byCompany'
            ? ReviewBy.COMPANY
            : Not(IsNull()),
        createdAt:
          getReviewsQueries.createdAtBegin != undefined && getReviewsQueries.createdAtEnd != undefined
            ? Between(getReviewsQueries.createdAtBegin, getReviewsQueries.createdAtEnd)
            : getReviewsQueries.createdAtBegin != undefined && getReviewsQueries.createdAtEnd == undefined
            ? MoreThanOrEqual(getReviewsQueries.createdAtBegin)
            : getReviewsQueries.createdAtBegin == undefined && getReviewsQueries.createdAtEnd != undefined
            ? LessThanOrEqual(getReviewsQueries.createdAtEnd)
            : Not(IsNull()),
        rate: getReviewsQueries.rateFrom != undefined ? MoreThanOrEqual(getReviewsQueries.rateFrom) : Not(IsNull()),
      },
      relations: ['reviewer', 'reviewee', 'job', 'job.company'],
      order: { createdAt: 'DESC' },
      skip: (getReviewsQueries.page > 0 ? getReviewsQueries.page - 1 : 0) * records,
      take: records,
    });

    const response = new GetReviewsResponse();
    response.totalRecords = totalRecords;
    response.reviews = _reviews.map((_review) => this.mapper.map(_review, Review, ReviewEntity));
    return response;
  }

  async getReviewsOfUser(
    getReviewsOfUserParams: GetReviewsOfUserParams,
    getReviewsQueries: GetReviewsQueries,
  ): Promise<GetReviewsResponse> {
    const _user = await this.userRepository.findOne({ id: getReviewsOfUserParams.userId });

    if (!_user) {
      throw new NotFoundException("Can't find user");
    }

    const records = getReviewsQueries.records != undefined ? getReviewsQueries.records : 10;
    const [_reviews, totalRecords] = await this.reviewRepository.findAndCount({
      where: {
        reviewer: {
          id: getReviewsOfUserParams.type == 'byUser' ? getReviewsOfUserParams.userId : Not(IsNull()),
        },
        reviewee: {
          id: getReviewsOfUserParams.type == 'fromCompany' ? getReviewsOfUserParams.userId : IsNull(),
        },
        reviewBy: getReviewsOfUserParams.type == 'byUser' ? ReviewBy.FREELANCE : ReviewBy.COMPANY,
        createdAt:
          getReviewsQueries.createdAtBegin != undefined && getReviewsQueries.createdAtEnd != undefined
            ? Between(getReviewsQueries.createdAtBegin, getReviewsQueries.createdAtEnd)
            : getReviewsQueries.createdAtBegin != undefined && getReviewsQueries.createdAtEnd == undefined
            ? MoreThanOrEqual(getReviewsQueries.createdAtBegin)
            : getReviewsQueries.createdAtBegin == undefined && getReviewsQueries.createdAtEnd != undefined
            ? LessThanOrEqual(getReviewsQueries.createdAtEnd)
            : Not(IsNull()),
        rate: getReviewsQueries.rateFrom != undefined ? MoreThanOrEqual(getReviewsQueries.rateFrom) : Not(IsNull()),
      },
      relations: ['reviewer', 'reviewee', 'job', 'job.company'],
      order: { createdAt: 'DESC' },
      skip: (getReviewsQueries.page > 0 ? getReviewsQueries.page - 1 : 0) * records,
      take: records,
    });

    const response = new GetReviewsResponse();
    response.totalRecords = totalRecords;
    response.reviews = _reviews.map((_review) => this.mapper.map(_review, Review, ReviewEntity));
    return response;
  }

  async getReviewsOfCompany(
    getReviewsOfCompanyParams: GetReviewsOfCompanyParams,
    getReviewsQueries: GetReviewsQueries,
  ): Promise<GetReviewsResponse> {
    const _company = await this.companyRepository.findOne({ id: getReviewsOfCompanyParams.companyId });

    if (!_company) {
      throw new NotFoundException("Can't find copmany");
    }

    const records = getReviewsQueries.records != undefined ? getReviewsQueries.records : 10;
    const [_reviews, totalRecords] = await this.reviewRepository.findAndCount({
      where: {
        job: { company: { id: getReviewsOfCompanyParams.companyId } },
        reviewBy: getReviewsOfCompanyParams.type == 'byCompany' ? ReviewBy.COMPANY : ReviewBy.FREELANCE,
        createdAt:
          getReviewsQueries.createdAtBegin != undefined && getReviewsQueries.createdAtEnd != undefined
            ? Between(getReviewsQueries.createdAtBegin, getReviewsQueries.createdAtEnd)
            : getReviewsQueries.createdAtBegin != undefined && getReviewsQueries.createdAtEnd == undefined
            ? MoreThanOrEqual(getReviewsQueries.createdAtBegin)
            : getReviewsQueries.createdAtBegin == undefined && getReviewsQueries.createdAtEnd != undefined
            ? LessThanOrEqual(getReviewsQueries.createdAtEnd)
            : Not(IsNull()),
        rate: getReviewsQueries.rateFrom != undefined ? MoreThanOrEqual(getReviewsQueries.rateFrom) : Not(IsNull()),
      },
      relations: ['reviewer', 'reviewee', 'job', 'job.company'],
      order: { createdAt: 'DESC' },
      skip: (getReviewsQueries.page > 0 ? getReviewsQueries.page - 1 : 0) * records,
      take: records,
    });

    const response = new GetReviewsResponse();
    response.totalRecords = totalRecords;
    response.reviews = _reviews.map((_review) => this.mapper.map(_review, Review, ReviewEntity));
    return response;
  }

  async getReview(getReviewParams: GetReviewParams): Promise<Review> {
    const _review = await this.reviewRepository.findOne({
      where: { id: getReviewParams.reviewId },
      relations: ['reviewer', 'reviewee', 'job', 'job.company'],
      withDeleted: true,
    });

    if (!_review) {
      throw new NotFoundException('Cannot find review of job');
    }

    return this.mapper.map(_review, Review, ReviewEntity);
  }
}
