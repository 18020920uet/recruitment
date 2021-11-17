import { Controller, Get } from '@nestjs/common';

import { ApplicationArrayApiOkResponse, ApplicationApiOkResponse } from '@Common/decorators/swagger.decorator';

import { GetJobsResponse, GetJobDetailResponse } from './dtos/responses';

@Controller('jobs')
export class JobsController {

  @Get()
  @ApplicationApiOkResponse(GetJobsResponse)
  getJobs(): GetJobsResponse {
    const response = new GetJobsResponse();
    response.totalRecords = 0;
    response.jobs = [];
    return response;
  }


  @Get(':jobId')
  @ApplicationApiOkResponse(GetJobDetailResponse)
  getJobDetail(): GetJobDetailResponse {
    return {
      jobDetail: null,
      relatedJobs: []
    }
  }
}
