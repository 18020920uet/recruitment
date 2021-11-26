import { Controller, Get, UseGuards, Put, Param, Post, Query, Delete, Body, UseInterceptors } from '@nestjs/common';

import {
  ApiInternalServerErrorResponse,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthenticationGuard } from '@Modules/authentication/jwt-authentication.guard';

import {
  InternalServerErrorResponse,
  ValidationFailResponse,
  UnauthorizedResponse,
  ForbiddenResponse,
  NotFoundResponse,
} from '@Decorators/swagger.error-responses.decorator';
import {
  ApplicationApiOkResponse,
  ApplicationApiCreateResponse,
  ApplicationArrayApiOkResponse,
} from '@Common/decorators/swagger.decorator';
import { CurrentUser } from '@Common/decorators/current-user.decorator';

import { UserEntity } from '@Entities/user.entity';

import { CurriculumVitae } from '@Shared/responses/curriculum-vitae';
import { ReviewByUser } from '@Shared/responses/review-by-user';
import { Review } from '@Shared/responses/review';

import {
  GetUserProfileParams,
  CreateReviewRequest,
  UpdateReviewRequest,
  DeleteReviewParams,
  UpdateReviewParams,
  CreateReviewParam,
  GetReviewsParam,
  GetReviewsQuery,
  GetUsersQuery,
  GetCvParam,
} from './dtos/requests';
import { DeleteReviewResponse, GetUsersResponse, GetUserProfileResponse } from './dtos/responses';

import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Get users by filter' })
  @ApplicationApiOkResponse(GetUsersResponse)
  @ApiBadRequestResponse({ description: 'Validation fail', type: ValidationFailResponse })
  @ApiInternalServerErrorResponse({ description: 'Server error', type: InternalServerErrorResponse })
  async getUsers(@Query() getUsersQuery: GetUsersQuery): Promise<GetUsersResponse> {
    return await this.usersService.getUsers(getUsersQuery);
  }

  @Get(':userId/profile')
  @ApiOperation({ summary: 'Get user detail' })
  @ApplicationApiOkResponse(GetUserProfileResponse)
  @ApiNotFoundResponse({ description: 'Not found user', type: NotFoundResponse })
  @ApiInternalServerErrorResponse({ description: 'Server error', type: InternalServerErrorResponse })
  async getUserProfile(@Param() getUserProfileParams: GetUserProfileParams): Promise<GetUserProfileResponse> {
    return await this.usersService.getUserProfile(getUserProfileParams);
  }

  @Get(':userId/cv')
  @ApiOperation({ summary: 'Get user cv' })
  @ApplicationApiOkResponse(CurriculumVitae)
  @ApiNotFoundResponse({ description: 'Not found user', type: NotFoundResponse })
  @ApiInternalServerErrorResponse({ description: 'Server error', type: InternalServerErrorResponse })
  async getCurriculumVitae(@Param() getCvParam: GetCvParam): Promise<CurriculumVitae> {
    return await this.usersService.getCurriculumVitae(getCvParam.userId);
  }

  @Get(':userId/reviews')
  @ApiOperation({ summary: 'Get user reviews' })
  @ApplicationArrayApiOkResponse(Review)
  @ApiNotFoundResponse({ description: 'Not found user', type: NotFoundResponse })
  @ApiBadRequestResponse({ description: 'Validation fail', type: ValidationFailResponse })
  @ApiInternalServerErrorResponse({ description: 'Server error', type: InternalServerErrorResponse })
  async getReviews(
    @Param() getReviewsParam: GetReviewsParam,
    @Query() getReviewsQuery: GetReviewsQuery,
  ): Promise<Review[]> {
    return await this.usersService.getReviews(getReviewsParam.userId, getReviewsQuery.page);
  }

  @Get(':userId/reviewsByUser')
  @ApiOperation({ summary: 'Get reviews write by user' })
  @ApplicationArrayApiOkResponse(ReviewByUser)
  @ApiNotFoundResponse({ description: 'Not found user', type: NotFoundResponse })
  @ApiBadRequestResponse({ description: 'Validation fail', type: ValidationFailResponse })
  @ApiInternalServerErrorResponse({ description: 'Server error', type: InternalServerErrorResponse })
  async getReviewsByUser(
    @Param() getReviewsParam: GetReviewsParam,
    @Query() getReviewsQuery: GetReviewsQuery,
  ): Promise<ReviewByUser[]> {
    return await this.usersService.getReviewsByUser(getReviewsParam.userId, getReviewsQuery.page);
  }

  @Post(':userId/review')
  @UseGuards(JwtAuthenticationGuard)
  @ApiOperation({ summary: 'Post a review' })
  @ApiBearerAuth('access-token')
  @ApplicationApiCreateResponse(Review)
  @ApiNotFoundResponse({ description: 'Cannot find user', type: NotFoundResponse })
  @ApiBadRequestResponse({ description: 'Validation fail', type: ValidationFailResponse })
  @ApiUnauthorizedResponse({ description: 'Token expired or no token', type: UnauthorizedResponse })
  @ApiInternalServerErrorResponse({ description: 'Server error', type: InternalServerErrorResponse })
  async createReview(
    @CurrentUser() _currentUser: UserEntity,
    @Param() createReviewParam: CreateReviewParam,
    @Body() createReviewRequest: CreateReviewRequest,
  ): Promise<Review> {
    return await this.usersService.createReview(_currentUser, createReviewParam, createReviewRequest);
  }

  @Put(':userId/reviews/:reviewId')
  @UseGuards(JwtAuthenticationGuard)
  @ApiOperation({ summary: 'Update review' })
  @ApiBearerAuth('access-token')
  @ApplicationApiOkResponse(Review)
  @ApiForbiddenResponse({ description: 'No permission', type: ForbiddenResponse })
  @ApiBadRequestResponse({ description: 'Validation fail', type: ValidationFailResponse })
  @ApiNotFoundResponse({ description: 'Cannot find user or review', type: NotFoundResponse })
  @ApiUnauthorizedResponse({ description: 'Token expired or no token', type: UnauthorizedResponse })
  @ApiInternalServerErrorResponse({ description: 'Server error', type: InternalServerErrorResponse })
  async updateReview(
    @CurrentUser() _currentUser: UserEntity,
    @Param() updateReviewParams: UpdateReviewParams,
    @Body() updateReviewRequest: UpdateReviewRequest,
  ): Promise<Review> {
    return await this.usersService.updateReview(_currentUser, updateReviewParams, updateReviewRequest);
  }

  @Delete(':userId/reviews/:reviewId')
  @UseGuards(JwtAuthenticationGuard)
  @ApiOperation({ summary: 'Detete review' })
  @ApiBearerAuth('access-token')
  @ApplicationApiOkResponse(DeleteReviewResponse)
  @ApiForbiddenResponse({ description: 'No permission', type: ForbiddenResponse })
  @ApiNotFoundResponse({ description: 'Cannot find user or review', type: NotFoundResponse })
  @ApiUnauthorizedResponse({ description: 'Token expired or no token', type: UnauthorizedResponse })
  @ApiInternalServerErrorResponse({ description: 'Server error', type: InternalServerErrorResponse })
  async deleteReview(
    @CurrentUser() _currentUser: UserEntity,
    @Param() deleteReviewParams: DeleteReviewParams,
  ): Promise<DeleteReviewResponse> {
    return await this.usersService.deleteReview(_currentUser, deleteReviewParams);
  }
}
