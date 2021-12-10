import { Body, Controller, Get, Param, Put, Query, UseInterceptors, UploadedFiles, UseGuards } from '@nestjs/common';
import {
  ApiInternalServerErrorResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
  ApiConsumes,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

import { imagesOfCompaniesStorage } from '@Common/storages/images.storage';

import { ApplicationArrayApiOkResponse, ApplicationApiOkResponse } from '@Common/decorators/swagger.decorator';
import {
  InternalServerErrorResponse,
  ValidationFailResponse,
  NotFoundResponse,
} from '@Decorators/swagger.error-responses.decorator';

import { CompanyEntity } from '@Entities/company.entity';
import { UserEntity } from '@Entities/user.entity';

import { RequireCompanyRole } from '@Common/decorators/require-company-roles.decorator';
import { CurrentCompany } from '@Common/decorators/current-company.decorator';
import { CurrentUser } from '@Common/decorators/current-user.decorator';

import { JwtAuthenticationGuard } from '@Common/guard/jwt-authentication.guard';
import { CompanyRoleGuard } from '@Common/guard/company-role.guard';
import { CompanyGuard } from '@Common/guard/company.guard';

import { GetCompanyAnalysisResponse, GetCompanyDetailResponse, GetJobsOfCompanyResponse } from './dtos/responses';
import {
  GetCompaniesFilterWithTheFirstCharacterInNameQueries,
  UpdateCompanyInformationRequest,
  UpdateCompanyInformationParams,
  GetJobsOfCompanyQueries,
  GetCompanyDetailParams,
  GetJobsOfCompanyParams,
  GetCompanyAnalysisParams,
} from './dtos/requests';
import { RequireRole } from '@Common/decorators/require-role.decorator';

import { CompanyRole } from '@Shared/enums/company-role';
import { Company } from '@Shared/responses/company';
import { Role } from '@Shared/enums/role';

import { CompaniesService } from './companies.service';

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
    @Query() getCompaniesFilterWithTheFirstCharacterInNameQueries: GetCompaniesFilterWithTheFirstCharacterInNameQueries,
  ): Promise<Company[]> {
    return await this.companiesService.getCompanies(getCompaniesFilterWithTheFirstCharacterInNameQueries);
  }

  @Put(':companyId')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'photos', maxCount: 5 },
        { name: 'logo', maxCount: 1 },
      ],
      imagesOfCompaniesStorage,
    ),
  )
  @RequireRole(Role.COMPANY)
  @RequireCompanyRole(CompanyRole.OWNER)
  @UseGuards(JwtAuthenticationGuard, CompanyGuard, CompanyRoleGuard)
  @ApiOperation({ summary: "Update company's information" })
  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth('access-token')
  @ApplicationApiOkResponse(GetCompanyDetailResponse)
  @ApiNotFoundResponse({ description: 'Not found', type: NotFoundResponse })
  @ApiInternalServerErrorResponse({ description: 'Server error', type: InternalServerErrorResponse })
  async updateCompanyInformation(
    @CurrentUser() _currentUser: UserEntity,
    @CurrentCompany() _currentCompany: CompanyEntity,
    @Param() updateCompanyInformationParams: UpdateCompanyInformationParams,
    @Body() updateCompanyInformationRequest: UpdateCompanyInformationRequest,
    @UploadedFiles() files: { logo?: Express.Multer.File[]; photos?: Express.Multer.File[] },
  ): Promise<GetCompanyDetailResponse> {
    return await this.companiesService.updateCompanyInformation(
      _currentUser,
      _currentCompany,
      updateCompanyInformationParams,
      updateCompanyInformationRequest,
      files,
    );
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
  @ApiOperation({ summary: "Get a company's jobs" })
  @ApplicationApiOkResponse(GetJobsOfCompanyResponse)
  @ApiNotFoundResponse({ description: 'Not found', type: NotFoundResponse })
  @ApiInternalServerErrorResponse({ description: 'Server error', type: InternalServerErrorResponse })
  async getJobsOfCompany(
    @Param() getJobsOfCompanyParams: GetJobsOfCompanyParams,
    @Query() getJobsOfCompanyQueries: GetJobsOfCompanyQueries,
  ): Promise<GetJobsOfCompanyResponse> {
    return this.companiesService.getJobsOfCompany(getJobsOfCompanyParams, getJobsOfCompanyQueries);
  }

  @Get(':companyId/analysis')
  @ApiOperation({ summary: 'Get a company detail' })
  @ApplicationApiOkResponse(GetCompanyAnalysisResponse)
  @ApiNotFoundResponse({ description: 'Not found', type: NotFoundResponse })
  @ApiInternalServerErrorResponse({ description: 'Server error', type: InternalServerErrorResponse })
  async getCompanyAnalysis(
    @Param() getCompanyAnalysisParams: GetCompanyAnalysisParams,
  ): Promise<GetCompanyAnalysisResponse> {
    return await this.companiesService.getCompanyAnalysis(getCompanyAnalysisParams);
  }
}
