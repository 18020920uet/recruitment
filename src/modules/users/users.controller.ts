import { Controller, Get, UseGuards, Put, Param, Post, Query, Delete, Body } from '@nestjs/common';

import {
  ApiInternalServerErrorResponse,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiBearerAuth,
  ApiTags,
} from '@nestjs/swagger';
import {
  InternalServerErrorResponse,
  ValidationFailResponse,
  UnauthorizedResponse,
  ForbiddenResponse,
  NotFoundResponse,
} from '@Decorators/swagger.error-responses.decorator';

import { JwtAuthenticationGuard } from '@Modules/authentication/jwt-authentication.guard';

import { CurrentUser } from '@Common/decorators/current-user.decorator';
import {
  ApplicationApiOkResponse,
  ApplicationApiCreateResponse,
  ApplicationArrayApiOkResponse,
} from '@Common/decorators/swagger.decorator';

import { UserEntity } from '@Entities/user.entity';

import { CurriculumVitae } from '@Shared/responses/curriculum-vitae';
import { ReviewByUser } from '@Shared/responses/review-by-user';
import { Review } from '@Shared/responses/review';

import {
  GetReviewsQuery,
  CreateReviewRequest,
  UpdateReviewRequest,
  CreateReviewParam,
  UpdateReviewParams,
  DeleteReviewParams,
} from './dtos/requests';
import { DeleteReviewResponse } from './dtos/responses';

import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get(':userId/cv')
  @ApplicationApiOkResponse(CurriculumVitae)
  @ApiNotFoundResponse({ description: 'Not found user', type: NotFoundResponse })
  @ApiInternalServerErrorResponse({ description: 'Server error', type: InternalServerErrorResponse })
  async getCurriculumnVitae(@Param('userId') userId: string): Promise<CurriculumVitae> {
    return await this.usersService.getCurriculumnVitae(userId);
  }

  @Get(':userId/reviews')
  @ApplicationArrayApiOkResponse(Review)
  @ApiNotFoundResponse({ description: 'Not found user', type: NotFoundResponse })
  @ApiBadRequestResponse({ description: 'Validation fail', type: ValidationFailResponse })
  @ApiInternalServerErrorResponse({ description: 'Server error', type: InternalServerErrorResponse })
  async getReviews(@Param('userId') userId: string, @Query() getReviewsQuery: GetReviewsQuery): Promise<Review[]> {
    return await this.usersService.getReviews(userId, getReviewsQuery.page);
  }

  @Get(':userId/reviewsByUser')
  @ApplicationArrayApiOkResponse(ReviewByUser)
  @ApiNotFoundResponse({ description: 'Not found user', type: NotFoundResponse })
  @ApiBadRequestResponse({ description: 'Validation fail', type: ValidationFailResponse })
  @ApiInternalServerErrorResponse({ description: 'Server error', type: InternalServerErrorResponse })
  async getReviewsByUser(
    @Param('userId') userId: string,
    @Query() getReviewsQuery: GetReviewsQuery
  ): Promise<ReviewByUser[]> {
    return await this.usersService.getReviewsByUser(userId, getReviewsQuery.page);
  }

  @Post(':userId/review')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthenticationGuard)
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
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthenticationGuard)
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
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthenticationGuard)
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
