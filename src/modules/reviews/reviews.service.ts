import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/types';

import { ReviewEntity } from '@Entities/review.entity';
import { UserEntity } from '@Entities/user.entity';

import { JobEmployeeRepositoty } from '@Repositories/job-employee.repository';
import { ReviewRepository } from '@Repositories/review.repository';
import { UserRepository } from '@Repositories/user.repository';
import { JobRepository } from '@Repositories/job.repository';

import { Review } from '@Shared/responses/review';

import {
  CreateReviewOfJobFromCompanyParams,
  CreateReviewOfJobFromCompanyRequest,
  CreateReviewOfJobFromUserParams,
  CreateReviewOfJobFromUserRequest,
  DeleteReviewParams,
  GetReviewParams,
  UpdateReviewParams,
  UpdateReviewRequest,
} from './dtos/requests';
import { ReviewBy } from '@Shared/enums/review-by';
import { JobStatus } from '@Shared/enums/job-status';
import { CompanyEntity } from '@Entities/company.entity';

// import { CreateReviewParam, CreateReviewRequest, UpdateReviewParams } from './dtos/requests';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectMapper() private readonly mapper: Mapper,
    private jobEmployeeRepository: JobEmployeeRepositoty,
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

    // Tinh toan review

    await this.reviewRepository.save(_review);

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

    _review.rate = updateReviewRequest.rate;
    _review.comment = updateReviewRequest.comment;

    // Cập nhật điểm

    await this.reviewRepository.save(_review);
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

    await this.reviewRepository.save(_review);
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

    await this.reviewRepository.save(_review);
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

    _review.comment = updateReviewRequest.comment;
    _review.rate = updateReviewRequest.rate;
    _review.reviewer = _currentUser;
    _review.updatedAt = new Date();

    // Cập nhật điểm

    await this.reviewRepository.save(_review);
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

    await this.reviewRepository.save(_review);
    return this.mapper.map(_review, Review, ReviewEntity);
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
