import { Controller, Get, Param, Query } from '@nestjs/common';
import {
  ApiInternalServerErrorResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { ApplicationArrayApiOkResponse, ApplicationApiOkResponse } from '@Common/decorators/swagger.decorator';
import {
  InternalServerErrorResponse,
  ValidationFailResponse,
  NotFoundResponse,
} from '@Decorators/swagger.error-responses.decorator';

import { CompaniesService } from './companies.service';

import { Company } from '@Shared/responses/company';
import { GetCompanyDetailResponse, GetJobsOfCompanyResponse } from './dtos/responses';
import { GetCompaniesFilterWithTheFirstCharacterInNameQuery, GetCompanyDetailParams, GetJobsOfCompanyParams, GetJobsOfCompanyQueries } from './dtos/requests';

@ApiTags('companies')
@Controller('companies')
export class CompaniesController {
  constructor(private companiesService: CompaniesService) {}

  @Get()
  @ApiOperation({ summary: 'Get 6 companies by first charater in name or 10 companies' })
  @ApplicationArrayApiOkResponse(Company)
  @ApiBadRequestResponse({ description: 'Validation fail', type: ValidationFailResponse })
  @ApiInternalServerErrorResponse({ description: 'Server error', type: InternalServerErrorResponse })
  async getCompanies(
    @Query() getCompaniesFilterWithTheFirstCharacterInNameQuery: GetCompaniesFilterWithTheFirstCharacterInNameQuery,
  ): Promise<Company[]> {
    return await this.companiesService.getCompanies(getCompaniesFilterWithTheFirstCharacterInNameQuery);
  }

  @Get(':companyId/detail')
  @ApiOperation({ summary: 'Get a company detail' })
  @ApplicationApiOkResponse(GetCompanyDetailResponse)
  @ApiNotFoundResponse({ description: 'Not found', type: NotFoundResponse })
  @ApiInternalServerErrorResponse({ description: 'Server error', type: InternalServerErrorResponse })
  async getCompanyDetail(@Param() getCompanyDetailParams: GetCompanyDetailParams): Promise<GetCompanyDetailResponse> {
    return await this.companiesService.getCompanyDetail(getCompanyDetailParams);
  }

  @Get(':companyId/jobs')
  @ApiOperation({ summary: "Get a company's jobs "})
  @ApplicationApiOkResponse(GetJobsOfCompanyResponse)
  @ApiNotFoundResponse({ description: 'Not found', type: NotFoundResponse })
  @ApiInternalServerErrorResponse({ description: 'Server error', type: InternalServerErrorResponse })
  async getJobsOfCompany(
    @Param() getJobsOfCompanyParams: GetJobsOfCompanyParams, @Query() getJobsOfCompanyQueries: GetJobsOfCompanyQueries
  ): Promise<GetJobsOfCompanyResponse> {
    return this.companiesService.getJobsOfCompany(getJobsOfCompanyParams, getJobsOfCompanyQueries);
  }
}
