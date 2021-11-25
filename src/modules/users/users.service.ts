import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectMapper } from '@automapper/nestjs';
import type { Mapper } from '@automapper/types';

import { CurriculumVitaeEntity } from '@Entities/curriculum-vitae.entity';
import { ReviewEntity } from '@Entities/review.entity';
import { UserEntity } from '@Entities/user.entity';

import { CurriculumVitaeRepository } from '@Repositories/curriculum-vitae.repository';
import { ReviewRepository } from '@Repositories/review.repository';
import { UserRepository } from '@Repositories/user.repository';

import { CurriculumVitae } from '@Shared/responses/curriculum-vitae';
import { ReviewByUser } from '@Shared/responses/review-by-user';
import { Review } from '@Shared/responses/review';

import {
  CreateReviewRequest,
  UpdateReviewRequest,
  CreateReviewParam,
  UpdateReviewParams,
  DeleteReviewParams,
} from './dtos/requests';
import { DeleteReviewResponse } from './dtos/responses';

@Injectable()
export class UsersService {
  constructor(
    @InjectMapper() private readonly mapper: Mapper,
    private curriculumnVitaeRepository: CurriculumVitaeRepository,
    private reviewRepository: ReviewRepository,
    private userRepository: UserRepository,
    private configService: ConfigService,
  ) {}

  async getCurriculumnVitae(userId: string): Promise<CurriculumVitae> {
    const _cv = await this.curriculumnVitaeRepository.findOne({
      where: { userId: userId },
      relations: ['experiences', 'user', 'skills', 'languages', 'nationality'],
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
}
