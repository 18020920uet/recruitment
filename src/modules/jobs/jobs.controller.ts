import { Controller, Get, Query, Param, Post, Put, Delete, Body, UseGuards } from '@nestjs/common';
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

import { ApplicationApiCreateResponse, ApplicationApiOkResponse } from '@Decorators/swagger.decorator';
import {
  InternalServerErrorResponse,
  ValidationFailResponse,
  UnauthorizedResponse,
  ForbiddenResponse,
  NotFoundResponse,
} from '@Decorators/swagger.error-responses.decorator';

import { JwtAuthenticationGuard } from '@Common/guard/jwt-authentication.guard';
import { CompanyRoleGuard } from '@Common/guard/company-role.guard';
import { FreelanceGuard } from '@Common/guard/freelance.guard';
import { CompanyGuard } from '@Common/guard/company.guard';

import { RequireCompanyRole } from '@Common/decorators/require-company-roles.decorator';
import { RequireRole } from '@Common/decorators/require-role.decorator';

import { JobsService } from './jobs.service';

import {
  RemoveEmployeeFromJobParams,
  ChangeJobApplyStatusRequest,
  GetCandidatesOfJobQuerires,
  ChangeJobApplyStatusParams,
  GetEmployeesOfJobQuerires,
  GetCandidatesOfJobParams,
  GetEmployeesOfJobParams,
  GetJobDetailParams,
  UpdateJobRequest,
  CreateJobRequest,
  FinishJobParams,
  ApplyJobRequest,
  UpdateJobParams,
  DeleteJobParams,
  GetJobsQueries,
  ApplyJobParams,
} from './dtos/requests';
import {
  GetCandidatesOfJobResponse,
  GetEmployeesOfJobResponse,
  GetJobDetailResponse,
  FinishJobResponse,
  DeleteJobResponse,
  GetJobsResponse,
  CandidateOfJob,
  EmployeeOfJob,
  JobDetail,
} from './dtos/responses';

import { Role } from '@Shared/enums/role';
import { CompanyRole } from '@Shared/enums/company-role';

import { CurrentCompany } from '@Common/decorators/current-company.decorator';
import { CurrentUser } from '@Common/decorators/current-user.decorator';

import { CompanyEntity } from '@Entities/company.entity';
import { UserEntity } from '@Entities/user.entity';

@ApiTags('jobs')
@Controller('jobs')
export class JobsController {
  constructor(private jobsService: JobsService) {}

  @Get()
  @ApiOperation({ summary: 'Get jobs by filter' })
  @ApplicationApiOkResponse(GetJobsResponse)
  @ApiBadRequestResponse({ description: 'Validation fail', type: ValidationFailResponse })
  @ApiInternalServerErrorResponse({ description: 'Server error', type: InternalServerErrorResponse })
  async getJobs(@Query() getJobsQueries: GetJobsQueries): Promise<GetJobsResponse> {
    return await this.jobsService.getJobs(getJobsQueries);
  }

  @Get(':jobId')
  @ApiOperation({ summary: 'Get a job detail' })
  @ApplicationApiOkResponse(GetJobDetailResponse)
  @ApiNotFoundResponse({ description: 'Not found', type: NotFoundResponse })
  @ApiInternalServerErrorResponse({ description: 'Server error', type: InternalServerErrorResponse })
  async getJobDetail(@Param() getJobDetailParams: GetJobDetailParams): Promise<GetJobDetailResponse> {
    return await this.jobsService.getJobDetail(getJobDetailParams);
  }

  @Post()
  @RequireRole(Role.COMPANY)
  @RequireCompanyRole(CompanyRole.OWNER, CompanyRole.EMPLOYEE)
  @UseGuards(JwtAuthenticationGuard, CompanyGuard, CompanyRoleGuard)
  @ApiOperation({ summary: 'Create a job' })
  @ApiBearerAuth('access-token')
  @ApplicationApiCreateResponse(JobDetail)
  @ApiForbiddenResponse({ description: 'Forbidden', type: ForbiddenResponse })
  @ApiUnauthorizedResponse({ description: 'Unauthorized', type: UnauthorizedResponse })
  @ApiBadRequestResponse({ description: 'Validation fail', type: ValidationFailResponse })
  @ApiInternalServerErrorResponse({ description: 'Server error', type: InternalServerErrorResponse })
  async createJob(
    @CurrentUser() _currentUser: UserEntity,
    @CurrentCompany() _currentCompany: CompanyEntity,
    @Body() createJobRequest: CreateJobRequest,
  ): Promise<JobDetail> {
    return await this.jobsService.createJob(_currentUser, _currentCompany, createJobRequest);
  }

  @Put(':jobId')
  @RequireRole(Role.COMPANY)
  @RequireCompanyRole(CompanyRole.OWNER, CompanyRole.EMPLOYEE)
  @UseGuards(JwtAuthenticationGuard, CompanyGuard, CompanyRoleGuard)
  @ApiOperation({ summary: 'Update a job' })
  @ApiBearerAuth('access-token')
  @ApplicationApiOkResponse(JobDetail)
  @ApiNotFoundResponse({ description: 'Not found', type: NotFoundResponse })
  @ApiForbiddenResponse({ description: 'Forbidden', type: ForbiddenResponse })
  @ApiUnauthorizedResponse({ description: 'Unauthorized', type: UnauthorizedResponse })
  @ApiBadRequestResponse({ description: 'Validation fail', type: ValidationFailResponse })
  @ApiInternalServerErrorResponse({ description: 'Server error', type: InternalServerErrorResponse })
  async updateJob(
    @CurrentUser() _currentUser: UserEntity,
    @CurrentCompany() _currentCompany: CompanyEntity,
    @Param() updateJobParams: UpdateJobParams,
    @Body() updateJobRequest: UpdateJobRequest,
  ): Promise<JobDetail> {
    return await this.jobsService.updateJob(_currentUser, _currentCompany, updateJobParams, updateJobRequest);
  }

  @Delete(':jobId')
  @RequireRole(Role.COMPANY)
  @RequireCompanyRole(CompanyRole.OWNER, CompanyRole.EMPLOYEE)
  @UseGuards(JwtAuthenticationGuard, CompanyGuard, CompanyRoleGuard)
  @ApiOperation({ summary: 'Delete a job' })
  @ApiBearerAuth('access-token')
  @ApplicationApiOkResponse(DeleteJobResponse)
  @ApiNotFoundResponse({ description: 'Not found', type: NotFoundResponse })
  @ApiForbiddenResponse({ description: 'Forbidden', type: ForbiddenResponse })
  @ApiUnauthorizedResponse({ description: 'Unauthorized', type: UnauthorizedResponse })
  @ApiInternalServerErrorResponse({ description: 'Server error', type: InternalServerErrorResponse })
  async deleteJob(
    @CurrentUser() _currentUser: UserEntity,
    @CurrentCompany() _currentCompany: CompanyEntity,
    @Param() deleteJobParams: DeleteJobParams,
  ): Promise<DeleteJobResponse> {
    return await this.jobsService.deleteJob(_currentUser, _currentCompany, deleteJobParams);
  }

  @Put(':jobId/finish')
  @RequireRole(Role.COMPANY)
  @RequireCompanyRole(CompanyRole.OWNER, CompanyRole.EMPLOYEE)
  @UseGuards(JwtAuthenticationGuard, CompanyGuard, CompanyRoleGuard)
  @ApiOperation({ summary: 'Finish this job' })
  @ApiBearerAuth('access-token')
  @ApplicationApiOkResponse(FinishJobResponse)
  @ApiNotFoundResponse({ description: 'Not found', type: NotFoundResponse })
  @ApiForbiddenResponse({ description: 'Forbidden|Job is done', type: ForbiddenResponse })
  @ApiUnauthorizedResponse({ description: 'Unauthorized', type: UnauthorizedResponse })
  @ApiInternalServerErrorResponse({ description: 'Server error', type: InternalServerErrorResponse })
  async finishJob(
    @CurrentUser() _currentUser: UserEntity,
    @CurrentCompany() _currentCompany: CompanyEntity,
    @Param() finishJobParams: FinishJobParams,
  ): Promise<FinishJobResponse> {
    console.log(_currentCompany);
    return await this.jobsService.finishJob(_currentUser, _currentCompany, finishJobParams);
  }

  @Post(':jobId/apply')
  @RequireRole(Role.FREELANCE)
  @UseGuards(JwtAuthenticationGuard, FreelanceGuard)
  @ApiOperation({ summary: 'Apply for a job' })
  @ApiBearerAuth('access-token')
  @ApplicationApiCreateResponse(CandidateOfJob)
  @ApiNotFoundResponse({ description: 'Not found', type: NotFoundResponse })
  @ApiForbiddenResponse({ description: 'Forbidden|Already apply', type: ForbiddenResponse })
  @ApiUnauthorizedResponse({ description: 'Unauthorized', type: UnauthorizedResponse })
  @ApiInternalServerErrorResponse({ description: 'Server error', type: InternalServerErrorResponse })
  async applyJob(
    @CurrentUser() _currentUser: UserEntity,
    @Param() applyJobParams: ApplyJobParams,
    @Body() applyJobRequest: ApplyJobRequest,
  ): Promise<CandidateOfJob> {
    return await this.jobsService.applyOrReapplyJob(_currentUser, applyJobParams, applyJobRequest);
  }

  @Get(':jobId/candidates')
  @ApplicationApiOkResponse(GetCandidatesOfJobResponse)
  @ApiOperation({ summary: "Get a job's candidates" })
  @ApiNotFoundResponse({ description: 'Not found', type: NotFoundResponse })
  @ApiInternalServerErrorResponse({ description: 'Server error', type: InternalServerErrorResponse })
  async getJobCandidatesOfJob(
    @Param() getCandidatesOfJobParams: GetCandidatesOfJobParams,
    @Query() getCandidatesOfJobQueries: GetCandidatesOfJobQuerires,
  ): Promise<GetCandidatesOfJobResponse> {
    return await this.jobsService.getCandidatesOfJob(getCandidatesOfJobParams, getCandidatesOfJobQueries);
  }

  @Put(':jobId/candidates/:changeJobApplyStatus/:candidateId')
  @RequireRole(Role.COMPANY)
  @RequireCompanyRole(CompanyRole.OWNER, CompanyRole.EMPLOYEE)
  @UseGuards(JwtAuthenticationGuard, CompanyGuard, CompanyRoleGuard)
  @ApiOperation({ summary: 'Approve or reject a candidate' })
  @ApiBearerAuth('access-token')
  @ApplicationApiOkResponse(CandidateOfJob)
  @ApiNotFoundResponse({ description: 'Not found', type: NotFoundResponse })
  @ApiBadRequestResponse({ description: 'Validation fail', type: ValidationFailResponse })
  @ApiForbiddenResponse({
    description: 'Forbidden|User is employee|User has been approved|User has been rejected',
    type: ForbiddenResponse,
  })
  @ApiInternalServerErrorResponse({ description: 'Server error', type: InternalServerErrorResponse })
  async approveCandidateForJob(
    @CurrentUser() _currentUser: UserEntity,
    @CurrentCompany() _currentCompany: CompanyEntity,
    @Param() changeJobApplyStatusParams: ChangeJobApplyStatusParams,
    @Body() changeJobApplyStatusRequest: ChangeJobApplyStatusRequest,
  ): Promise<CandidateOfJob> {
    return await this.jobsService.approveOrRejectCandidateForJob(
      _currentUser,
      _currentCompany,
      changeJobApplyStatusParams,
      changeJobApplyStatusRequest,
    );
  }

  @Get(':jobId/employees')
  @ApplicationApiOkResponse(GetEmployeesOfJobResponse)
  @ApiOperation({ summary: "Get a job's employees" })
  @ApiNotFoundResponse({ description: 'Not found', type: NotFoundResponse })
  @ApiBadRequestResponse({ description: 'Validation fail', type: ValidationFailResponse })
  @ApiInternalServerErrorResponse({ description: 'Server error', type: InternalServerErrorResponse })
  async getEmployeesOfJobs(
    @Param() getEmployeesOfJobParams: GetEmployeesOfJobParams,
    @Query() getEmployeesOfJobQuerires: GetEmployeesOfJobQuerires,
  ): Promise<GetEmployeesOfJobResponse> {
    return await this.jobsService.getEmployeesOfJob(getEmployeesOfJobParams, getEmployeesOfJobQuerires);
  }

  @Delete(':jobId/employees/:employeeId')
  @RequireRole(Role.COMPANY)
  @RequireCompanyRole(CompanyRole.OWNER, CompanyRole.EMPLOYEE)
  @UseGuards(JwtAuthenticationGuard, CompanyGuard, CompanyRoleGuard)
  @ApiOperation({ summary: "Remove a job's employee" })
  @ApiBearerAuth('access-token')
  @ApplicationApiOkResponse(EmployeeOfJob)
  @ApiForbiddenResponse({
    description: 'Forbidden Resources|Employee had been removed',
    type: ForbiddenResponse,
  })
  @ApiNotFoundResponse({ description: 'Not found', type: NotFoundResponse })
  @ApiBadRequestResponse({ description: 'Validation fail', type: ValidationFailResponse })
  @ApiInternalServerErrorResponse({ description: 'Server error', type: InternalServerErrorResponse })
  async removeEmployeeFromJob(
    @CurrentUser() _currentUser: UserEntity,
    @CurrentCompany() _currentCompany: CompanyEntity,
    @Param() removeEmployeeFromJobParams: RemoveEmployeeFromJobParams,
  ): Promise<EmployeeOfJob> {
    return await this.jobsService.removeEmployeeFromJob(_currentUser, _currentCompany, removeEmployeeFromJobParams);
  }
}
