import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
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
import { CompanyEntity } from '@Entities/company.entity';

import { RequireCompanyRole } from '@Common/decorators/require-company-roles.decorator';
import { CurrentCompany } from '@Common/decorators/current-company.decorator';
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
  GetReviewsOfCompanyParams,
  GetReviewsOfUserParams,
  GetReviewsOfJobParams,
  GetReviewOfJobParams,
  UpdateReviewRequest,
  UpdateReviewParams,
  DeleteReviewParams,
  GetReviewsQueries,
  GetReviewParams,
} from './dtos/requests';
import { ReviewsService } from './reviews.service';
import { GetReviewsResponse } from './dtos/responses';

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

  @Get('jobs/:jobId/:type')
  @ApiOperation({ summary: 'Get reviews of a job' })
  @ApplicationApiOkResponse(GetReviewsResponse)
  @ApiNotFoundResponse({ description: "Can't find job", type: NotFoundResponse })
  @ApiInternalServerErrorResponse({ description: 'Server error', type: InternalServerErrorResponse })
  async getReviewsOfJob(
    @Param() getReviewsOfJobParams: GetReviewsOfJobParams,
    @Query() getReviewsQueries: GetReviewsQueries,
  ): Promise<GetReviewsResponse> {
    return await this.reviewsService.getReviewsOfJob(getReviewsOfJobParams, getReviewsQueries);
  }

  @Get('users/:userId/:type')
  @ApiOperation({ summary: 'Get reviews of a user' })
  @ApplicationApiOkResponse(GetReviewsResponse)
  @ApiNotFoundResponse({ description: "Can't find user", type: NotFoundResponse })
  @ApiInternalServerErrorResponse({ description: 'Server error', type: InternalServerErrorResponse })
  async getReviewsOfUser(
    @Param() getReviewsOfUserParams: GetReviewsOfUserParams,
    @Query() getReviewsQueries: GetReviewsQueries,
  ): Promise<GetReviewsResponse> {
    return await this.reviewsService.getReviewsOfUser(getReviewsOfUserParams, getReviewsQueries);
  }

  @Get('companies/:companyId/:type')
  @ApiOperation({ summary: 'Get reviews of a company' })
  @ApplicationApiOkResponse(GetReviewsResponse)
  @ApiNotFoundResponse({ description: "Can't find company", type: NotFoundResponse })
  @ApiInternalServerErrorResponse({ description: 'Server error', type: InternalServerErrorResponse })
  async getReviewsOfCompany(
    @Param() getReviewsOfCompanyParams: GetReviewsOfCompanyParams,
    @Query() getReviewsQueries: GetReviewsQueries,
  ): Promise<GetReviewsResponse> {
    return await this.reviewsService.getReviewsOfCompany(getReviewsOfCompanyParams, getReviewsQueries);
  }

  @Get(':reviewId')
  @ApiNotFoundResponse({ description: 'Cannot find review of job', type: NotFoundResponse })
  @ApiInternalServerErrorResponse({ description: 'Server error', type: InternalServerErrorResponse })
  @ApiOperation({ summary: 'Get review' })
  async getReview(@Param() getReviewParams: GetReviewParams): Promise<Review> {
    return await this.reviewsService.getReview(getReviewParams);
  }

  @Get('jobs/:jobId/:type/:userId')
  @ApiNotFoundResponse({ description: 'Cannot find review of job', type: NotFoundResponse })
  @ApiInternalServerErrorResponse({ description: 'Server error', type: InternalServerErrorResponse })
  @ApiOperation({ summary: 'Get review of job from user or company' })
  async getReviewOfJob(@Param() getReviewOfJobParams: GetReviewOfJobParams): Promise<Review> {
    return await this.reviewsService.getReviewOfJob(getReviewOfJobParams);
  }
}
