import { Controller, Get, Param, Query } from '@nestjs/common';

import {
  ApiInternalServerErrorResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import {
  InternalServerErrorResponse,
  ValidationFailResponse,
  BadRequestResponse,
  NotFoundResponse,
} from '@Decorators/swagger.error-responses.decorator';
import { ApplicationApiOkResponse } from '@Common/decorators/swagger.decorator';

import { CurriculumVitae } from '@Shared/responses/curriculum-vitae';

import {
  GetUserAnalysisParams,
  GetUserProfileParams,
  GetJobsOfUserQueries,
  GetJobsOfUserParams,
  GetUsersQuery,
  GetCvParam,
} from './dtos/requests';
import {
  GetUserAnalysisResponse,
  GetUserProfileResponse,
  GetJobsOfUserResponse,
  GetUsersResponse,
} from './dtos/responses';

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

  @Get(':userId/analysis')
  @ApiOperation({ summary: 'Get user detail' })
  @ApplicationApiOkResponse(GetUserAnalysisResponse)
  @ApiNotFoundResponse({ description: 'Not found user', type: NotFoundResponse })
  @ApiInternalServerErrorResponse({ description: 'Server error', type: InternalServerErrorResponse })
  async getUserJobsAnalysisDetail(
    @Param() getUserAnalysisParams: GetUserAnalysisParams,
  ): Promise<GetUserAnalysisResponse> {
    return await this.usersService.getUserAnalysis(getUserAnalysisParams);
  }

  @Get(':userId/jobs/:type')
  @ApiOperation({ summary: 'Get jobs of user' })
  @ApplicationApiOkResponse(GetJobsOfUserResponse)
  @ApiNotFoundResponse({ description: 'Not found user', type: NotFoundResponse })
  @ApiBadRequestResponse({ description: 'Unknown Job Status|Unknown type', type: BadRequestResponse })
  @ApiInternalServerErrorResponse({ description: 'Server error', type: InternalServerErrorResponse })
  async getJobsOfUser(
    @Param() getJobsOfUserParams: GetJobsOfUserParams,
    @Query() getJobsOfUserQueries: GetJobsOfUserQueries,
  ): Promise<GetJobsOfUserResponse> {
    return await this.usersService.getJobsOfUser(getJobsOfUserParams, getJobsOfUserQueries);
  }

  @Get(':userId/cv')
  @ApiOperation({ summary: 'Get user cv' })
  @ApplicationApiOkResponse(CurriculumVitae)
  @ApiNotFoundResponse({ description: 'Not found user', type: NotFoundResponse })
  @ApiInternalServerErrorResponse({ description: 'Server error', type: InternalServerErrorResponse })
  async getCurriculumVitae(@Param() getCvParam: GetCvParam): Promise<CurriculumVitae> {
    return await this.usersService.getCurriculumVitae(getCvParam.userId);
  }
}
