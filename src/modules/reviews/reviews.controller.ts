import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
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

import { ApplicationApiCreateResponse, ApplicationApiOkResponse } from '@Common/decorators/swagger.decorator';
import { JwtAuthenticationGuard } from '@Common/guard/jwt-authentication.guard';
import {
  InternalServerErrorResponse,
  ValidationFailResponse,
  UnauthorizedResponse,
  ForbiddenResponse,
  NotFoundResponse,
} from '@Common/decorators/swagger.error-responses.decorator';
import { CurrentUser } from '@Common/decorators/current-user.decorator';

import { UserEntity } from '@Entities/user.entity';

import { RequireCompanyRole } from '@Common/decorators/require-company-roles.decorator';
import { RequireRole } from '@Common/decorators/require-role.decorator';
import { CompanyRoleGuard } from '@Common/guard/company-role.guard';
import { FreelanceGuard } from '@Common/guard/freelance.guard';
import { CompanyGuard } from '@Common/guard/company.guard';

import { Review } from '@Shared/responses/review';

import { CompanyRole } from '@Shared/enums/company-role';
import { Role } from '@Shared/enums/role';

import {
  CreateReviewOfJobFromCompanyRequest,
  CreateReviewOfJobFromCompanyParams,
  CreateReviewOfJobFromUserRequest,
  CreateReviewOfJobFromUserParams,
  UpdateReviewRequest,
  UpdateReviewParams,
  DeleteReviewParams,
  GetReviewParams,
} from './dtos/requests';
import { ReviewsService } from './reviews.service';
import { CurrentCompany } from '@Common/decorators/current-company.decorator';
import { CompanyEntity } from '@Entities/company.entity';

@ApiTags('reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private reviewsService: ReviewsService) {}

  @Post('fromUser/:jobId')
  @RequireRole(Role.FREELANCE)
  @UseGuards(JwtAuthenticationGuard, FreelanceGuard)
  @ApiOperation({ summary: 'Create a review of job by user' })
  @ApiBearerAuth('access-token')
  @ApplicationApiCreateResponse(Review)
  @ApiNotFoundResponse({ description: "Can't find job", type: NotFoundResponse })
  @ApiBadRequestResponse({ description: 'Validation fail', type: ValidationFailResponse })
  @ApiUnauthorizedResponse({ description: 'Token expired or no token', type: UnauthorizedResponse })
  @ApiForbiddenResponse({
    description: "You are not this job's employee|This job is not completed yet",
    type: ForbiddenResponse,
  })
  @ApiInternalServerErrorResponse({ description: 'Server error', type: InternalServerErrorResponse })
  async createReviewForJobFromUser(
    @CurrentUser() _currentUser: UserEntity,
    @Param() createReviewOfJobFromUserParams: CreateReviewOfJobFromUserParams,
    @Body() createReviewOfJobFromUserRequest: CreateReviewOfJobFromUserRequest,
  ): Promise<Review> {
    return await this.reviewsService.createReviewOfJobFromUser(
      _currentUser,
      createReviewOfJobFromUserParams,
      createReviewOfJobFromUserRequest,
    );
  }

  @Put('fromUser/:reviewId')
  @RequireRole(Role.FREELANCE)
  @UseGuards(JwtAuthenticationGuard, FreelanceGuard)
  @ApiOperation({ summary: 'Update a review of job by user' })
  @ApiBearerAuth('access-token')
  @ApplicationApiOkResponse(Review)
  @ApiNotFoundResponse({ description: "Can't find review", type: NotFoundResponse })
  @ApiBadRequestResponse({ description: 'Bad Request|Validation fail', type: ValidationFailResponse })
  @ApiForbiddenResponse({ description: 'No permission to edit', type: ForbiddenResponse })
  @ApiUnauthorizedResponse({ description: 'Token expired or no token', type: UnauthorizedResponse })
  @ApiInternalServerErrorResponse({ description: 'Server error', type: InternalServerErrorResponse })
  async updateReviewOfJobFromUser(
    @CurrentUser() _currentUser: UserEntity,
    @Param() updateReviewParams: UpdateReviewParams,
    @Body() updateReviewRequest: UpdateReviewRequest,
  ): Promise<Review> {
    return await this.reviewsService.updateReviewOfJobFromUser(_currentUser, updateReviewParams, updateReviewRequest);
  }

  @Delete('fromUser/:reviewId')
  @RequireRole(Role.FREELANCE)
  @UseGuards(JwtAuthenticationGuard, FreelanceGuard)
  @ApiOperation({ summary: 'Delete a review of job by user' })
  @ApplicationApiOkResponse(Review)
  @ApiBearerAuth('access-token')
  @ApiNotFoundResponse({ description: "Can't find review", type: NotFoundResponse })
  @ApiForbiddenResponse({ description: 'No permission to edit', type: ForbiddenResponse })
  @ApiUnauthorizedResponse({ description: 'Token expired or no token', type: UnauthorizedResponse })
  @ApiInternalServerErrorResponse({ description: 'Server error', type: InternalServerErrorResponse })
  async deleteReviewOfJobFromUser(
    @CurrentUser() _currentUser: UserEntity,
    @Param() deleteReviewParams: DeleteReviewParams,
  ): Promise<Review> {
    return await this.reviewsService.deleteReviewOfJobFromUser(_currentUser, deleteReviewParams);
  }

  @Post('fromCompany/:jobId/:userId')
  @RequireRole(Role.COMPANY)
  @RequireCompanyRole(CompanyRole.OWNER, CompanyRole.EMPLOYEE)
  @UseGuards(JwtAuthenticationGuard, CompanyGuard, CompanyRoleGuard)
  @ApiOperation({ summary: 'Create a review of job by company' })
  @ApiBearerAuth('access-token')
  @ApplicationApiCreateResponse(Review)
  @ApiBadRequestResponse({ description: 'Validation fail', type: ValidationFailResponse })
  @ApiNotFoundResponse({ description: "Can't find job|Can't find user", type: NotFoundResponse })
  @ApiForbiddenResponse({
    description: 'No permission to write review|User are not employee of this job',
    type: ForbiddenResponse,
  })
  @ApiUnauthorizedResponse({ description: 'Token expired or no token', type: UnauthorizedResponse })
  @ApiInternalServerErrorResponse({ description: 'Server error', type: InternalServerErrorResponse })
  async createReviewOfJobFromCompany(
    @CurrentUser() _currentUser: UserEntity,
    @CurrentCompany() _currentCompany: CompanyEntity,
    @Param() createReviewOfJobFromCompanyParams: CreateReviewOfJobFromCompanyParams,
    @Body() createReviewOfJobFromCompanyRequest: CreateReviewOfJobFromCompanyRequest,
  ): Promise<Review> {
    return await this.reviewsService.createReviewOfJobFromCompany(
      _currentUser,
      _currentCompany,
      createReviewOfJobFromCompanyParams,
      createReviewOfJobFromCompanyRequest,
    );
  }

  @Put('fromCompany/:reviewId')
  @RequireRole(Role.COMPANY)
  @RequireCompanyRole(CompanyRole.OWNER, CompanyRole.EMPLOYEE)
  @UseGuards(JwtAuthenticationGuard, CompanyGuard, CompanyRoleGuard)
  @ApiOperation({ summary: 'Update a review of job by company' })
  @ApiBearerAuth('access-token')
  @ApplicationApiOkResponse(Review)
  @ApiNotFoundResponse({ description: "Can't find review", type: NotFoundResponse })
  @ApiBadRequestResponse({ description: 'Bad Request|Validation fail', type: ValidationFailResponse })
  @ApiForbiddenResponse({ description: 'No permission to edit', type: ForbiddenResponse })
  @ApiUnauthorizedResponse({ description: 'Token expired or no token', type: UnauthorizedResponse })
  @ApiInternalServerErrorResponse({ description: 'Server error', type: InternalServerErrorResponse })
  async updateReviewForJobFromCompany(
    @CurrentUser() _currentUser: UserEntity,
    @CurrentCompany() _currentCompany: CompanyEntity,
    @Param() updateReviewParams: UpdateReviewParams,
    @Body() updateReviewRequest: UpdateReviewRequest,
  ): Promise<Review> {
    return await this.reviewsService.updateReviewOfJobFromCompany(
      _currentUser,
      _currentCompany,
      updateReviewParams,
      updateReviewRequest,
    );
  }

  @Delete('fromCompany/:reviewId')
  @RequireRole(Role.COMPANY)
  @RequireCompanyRole(CompanyRole.OWNER, CompanyRole.EMPLOYEE)
  @UseGuards(JwtAuthenticationGuard, CompanyGuard, CompanyRoleGuard)
  @ApiOperation({ summary: 'Delete a review of job by company' })
  @ApiBearerAuth('access-token')
  @ApplicationApiOkResponse(Review)
  @ApiNotFoundResponse({ description: "Can't find review", type: NotFoundResponse })
  @ApiForbiddenResponse({ description: 'No permission to edit', type: ForbiddenResponse })
  @ApiUnauthorizedResponse({ description: 'Token expired or no token', type: UnauthorizedResponse })
  @ApiInternalServerErrorResponse({ description: 'Server error', type: InternalServerErrorResponse })
  async deleteReviewFromCompany(
    @CurrentUser() _currentUser: UserEntity,
    @CurrentCompany() _currentCompany: CompanyEntity,
    @Param() deleteReviewParams: DeleteReviewParams,
  ): Promise<Review> {
    return await this.reviewsService.deleteReviewOfJobFromCompany(_currentUser, _currentCompany, deleteReviewParams);
  }

  @Get('jobs/:jobId/:byUserOrByCompany')
  @ApiOperation({ summary: 'Get reviews of a job' })
  @ApiNotFoundResponse({ description: "Can't find job", type: NotFoundResponse })
  @ApiInternalServerErrorResponse({ description: 'Server error', type: InternalServerErrorResponse })
  async getReviewsOfJob(): Promise<Review[]> {
    return [];
  }

  @Get('users/:userId/:byUserOrToUser')
  @ApiOperation({ summary: 'Get reviews of a user' })
  async getReviewsOfUser(): Promise<Review[]> {
    return [];
  }

  @Get('companies/:companyId/:byCompanyOrToCompany')
  @ApiOperation({ summary: 'Get reviews of a company' })
  async getReviewsOfCompany(): Promise<Review[]> {
    return [];
  }

  @Get(':reviewId')
  @ApiNotFoundResponse({ description: 'Cannot find review of job', type: NotFoundResponse })
  @ApiInternalServerErrorResponse({ description: 'Server error', type: InternalServerErrorResponse })
  @ApiOperation({ summary: 'Get review' })
  async getReview(@Param() getReviewParams: GetReviewParams): Promise<Review> {
    return await this.reviewsService.getReview(getReviewParams);
  }

  // @UseGuards(JwtAuthenticationGuard)
  // @ApiOperation({ summary: 'Post a review' })
  // @ApiBearerAuth('access-token')
  // @ApplicationApiCreateResponse(Review)
  // @ApiNotFoundResponse({ description: 'Cannot find user', type: NotFoundResponse })
  // @ApiBadRequestResponse({ description: 'Validation fail', type: ValidationFailResponse })
  // @ApiUnauthorizedResponse({ description: 'Token expired or no token', type: UnauthorizedResponse })
  // @ApiInternalServerErrorResponse({ description: 'Server error', type: InternalServerErrorResponse })
  // async createReviewForCompany(
  //   @CurrentUser() _currentUser: UserEntity,
  //   // @Param() createReviewParam: CreateReviewParam,
  //   // @Body() createReviewRequest: CreateReviewRequest,
  // ): Promise<Review> {
  //   return null;
  // }

  // @Put(':userId/reviews/:reviewId')
  // @UseGuards(JwtAuthenticationGuard)
  // @ApiOperation({ summary: 'Update review' })
  // @ApiBearerAuth('access-token')
  // @ApplicationApiOkResponse(Review)
  // @ApiForbiddenResponse({ description: 'No permission', type: ForbiddenResponse })
  // @ApiBadRequestResponse({ description: 'Validation fail', type: ValidationFailResponse })
  // @ApiNotFoundResponse({ description: 'Cannot find user or review', type: NotFoundResponse })
  // @ApiUnauthorizedResponse({ description: 'Token expired or no token', type: UnauthorizedResponse })
  // @ApiInternalServerErrorResponse({ description: 'Server error', type: InternalServerErrorResponse })
  // async updateReview(
  //   @CurrentUser() _currentUser: UserEntity,
  //   // @Param() updateReviewParams: UpdateReviewParams,
  //   // @Body() updateReviewRequest: UpdateReviewRequest,
  // ): Promise<Review> {
  //   return null;
  //   // return await this.usersService.updateReview(_currentUser, updateReviewParams, updateReviewRequest);
  // }
  //
  // @Get(':userId/reviews')
  // @ApiOperation({ summary: 'Get user reviews' })
  // @ApplicationArrayApiOkResponse(Review)
  // @ApiNotFoundResponse({ description: 'Not found user', type: NotFoundResponse })
  // @ApiBadRequestResponse({ description: 'Validation fail', type: ValidationFailResponse })
  // @ApiInternalServerErrorResponse({ description: 'Server error', type: InternalServerErrorResponse })
  // async getReviews(): Promise<Review[]> {
  //   return [];
  // }
  //
  // @Get(':userId/reviewsByUser')
  // @ApiOperation({ summary: 'Get reviews write by user' })
  // @ApplicationArrayApiOkResponse(ReviewByUser)
  // @ApiNotFoundResponse({ description: 'Not found user', type: NotFoundResponse })
  // @ApiBadRequestResponse({ description: 'Validation fail', type: ValidationFailResponse })
  // @ApiInternalServerErrorResponse({ description: 'Server error', type: InternalServerErrorResponse })
  // async getReviewsByUser(
  // ): Promise<ReviewByUser[]> {
  //   return [];
  // }
  //
  // @Post(':userId/review')
  // @UseGuards(JwtAuthenticationGuard)
  // @ApiOperation({ summary: 'Post a review' })
  // @ApiBearerAuth('access-token')
  // @ApplicationApiCreateResponse(Review)
  // @ApiNotFoundResponse({ description: 'Cannot find user', type: NotFoundResponse })
  // @ApiBadRequestResponse({ description: 'Validation fail', type: ValidationFailResponse })
  // @ApiUnauthorizedResponse({ description: 'Token expired or no token', type: UnauthorizedResponse })
  // @ApiInternalServerErrorResponse({ description: 'Server error', type: InternalServerErrorResponse })
  // async createReview(
  //   @CurrentUser() _currentUser: UserEntity,
  // ): Promise<Review> {
  //   return null;
  // }
  //
  // @Delete(':userId/reviews/:reviewId')
  // @UseGuards(JwtAuthenticationGuard)
  // @ApiOperation({ summary: 'Delete review' })
  // @ApiBearerAuth('access-token')
  // @ApplicationApiOkResponse(Review)
  // @ApiForbiddenResponse({ description: 'No permission', type: ForbiddenResponse })
  // @ApiNotFoundResponse({ description: 'Cannot find user or review', type: NotFoundResponse })
  // @ApiUnauthorizedResponse({ description: 'Token expired or no token', type: UnauthorizedResponse })
  // @ApiInternalServerErrorResponse({ description: 'Server error', type: InternalServerErrorResponse })
  // async deleteReview(
  // ): Promise<Review> {
  //   return null;
  // }
}
