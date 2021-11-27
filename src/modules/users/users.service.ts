import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectMapper } from '@automapper/nestjs';
import type { Mapper } from '@automapper/types';
import { IsNull, Not, In, getManager, getRepository, Like, Between } from 'typeorm';

import { CurriculumVitaeSkillRelation } from '@Entities/curriculum-vitae-skill.relation';
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
  GetUserProfileParams,
  CreateReviewRequest,
  UpdateReviewRequest,
  UpdateReviewParams,
  DeleteReviewParams,
  CreateReviewParam,
  GetUsersQuery,
} from './dtos/requests';
import { DeleteReviewResponse, GetUsersResponse, GetUserProfileResponse, FreeLancer } from './dtos/responses';

@Injectable()
export class UsersService {
  constructor(
    @InjectMapper() private readonly mapper: Mapper,
    private curriculumVitaeRepository: CurriculumVitaeRepository,
    private reviewRepository: ReviewRepository,
    private userRepository: UserRepository,
    private configService: ConfigService,
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
        queryString = `SELECT * FROM "curriculum_vitaes_languages" WHERE language_id IN (${params}) GROUP BY cv_id, language_id`;
      } else {
        if (_cvIds.length != 0) {
          queryString =
            `SELECT * FROM "curriculum_vitaes_languages" WHERE language_id IN (${params}) ` +
            `AND cv_id IN (${_cvIds.map((cvId) => `'${cvId}'`).join(',')}) GROUP BY cv_id, language_id`;
        }
      }

      if (queryString != '') {
        _cvIds = (await getManager().query(queryString)).map((r) => r['cv_id']);
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
      relations: ['experiences', 'user', 'skillRelations', 'skillRelations.skill', 'languages', 'nationality', 'area'],
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
