import { Controller, Get, Query, Param } from '@nestjs/common';
import {
  ApiInternalServerErrorResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { ApplicationArrayApiOkResponse, ApplicationApiOkResponse } from '@Decorators/swagger.decorator';
import {
  InternalServerErrorResponse,
  ValidationFailResponse,
  NotFoundResponse,
} from '@Decorators/swagger.error-responses.decorator';

import { JobsService } from './jobs.service';

import { GetJobsQuery, GetJobDetailParam } from './dtos/requests';
import { GetJobsResponse, GetJobDetailResponse } from './dtos/responses';

@ApiTags('jobs')
@Controller('jobs')
export class JobsController {
  constructor(private jobsService: JobsService) {}

  @Get()
  @ApiOperation({ summary: 'Get 10 jobs by filter' })
  @ApplicationApiOkResponse(GetJobsResponse)
  @ApiBadRequestResponse({ description: 'Validation fail', type: ValidationFailResponse })
  @ApiInternalServerErrorResponse({ description: 'Server error', type: InternalServerErrorResponse })
  async getJobs(@Query() getJobsQuery: GetJobsQuery): Promise<GetJobsResponse> {
    return await this.jobsService.getJobs(getJobsQuery);
  }

  @Get(':jobId')
  @ApiOperation({ summary: 'Get a job detail' })
  @ApplicationApiOkResponse(GetJobDetailResponse)
  @ApiNotFoundResponse({ description: 'Not found', type: NotFoundResponse })
  @ApiInternalServerErrorResponse({ description: 'Server error', type: InternalServerErrorResponse })
  async getJobDetail(@Param() getJobDetailParam: GetJobDetailParam): Promise<GetJobDetailResponse> {
    return await this.jobsService.getJobDetail(getJobDetailParam);
  }
}
