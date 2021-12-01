import { ApiInternalServerErrorResponse, ApiOperation, ApiTags, ApiOkResponse } from '@nestjs/swagger';
import { Controller, Get, Query } from '@nestjs/common';

import { InternalServerErrorResponse } from '@Decorators/swagger.error-responses.decorator';
import { ApplicationArrayApiOkResponse } from '@Common/decorators/swagger.decorator';

import { NationalityEntity } from '@Entities/nationality.entity';
import { LanguageEntity } from '@Entities/language.entity';
import { CountryEntity } from '@Entities/country.entity';
import { SkillEntity } from '@Entities/skill.entity';
import { AreaEntity } from '@Entities/area.entity';

import { ResourcesService } from './resources.service';

import { BusinessField } from '@Shared/responses/business-field';
import { GetAreasQueries } from './dtos/requests';

@ApiTags('resources')
@Controller('resources')
export class ResourcesController {
  constructor(private resourcesService: ResourcesService) {}

  @Get('languages')
  @ApiOperation({ summary: "Get system's languages" })
  @ApplicationArrayApiOkResponse(LanguageEntity)
  @ApiInternalServerErrorResponse({ description: 'Server error', type: InternalServerErrorResponse })
  async getLanguages(): Promise<LanguageEntity[]> {
    return await this.resourcesService.getLanguages();
  }

  @Get('nationnalities')
  @ApiOperation({ summary: "Get system's nationalities" })
  @ApplicationArrayApiOkResponse(NationalityEntity)
  @ApiInternalServerErrorResponse({ description: 'Server error', type: InternalServerErrorResponse })
  async getNationnalities(): Promise<NationalityEntity[]> {
    return await this.resourcesService.getNationnalities();
  }

  @Get('countries')
  @ApiOperation({ summary: 'Get system countries' })
  @ApplicationArrayApiOkResponse(CountryEntity)
  @ApiInternalServerErrorResponse({ description: 'Server error', type: InternalServerErrorResponse })
  async getCountries(): Promise<CountryEntity[]> {
    return await this.resourcesService.getCountries();
  }

  @Get('areas')
  @ApiOperation({ summary: "Get system's areas" })
  @ApplicationArrayApiOkResponse(AreaEntity)
  @ApiInternalServerErrorResponse({ description: 'Server error', type: InternalServerErrorResponse })
  async getAreasByCountry(@Query() getAreasQueries: GetAreasQueries): Promise<AreaEntity[]> {
    return await this.resourcesService.getAreas(getAreasQueries);
  }

  @Get('skills')
  @ApiOperation({ summary: "Get system's skills" })
  @ApplicationArrayApiOkResponse(SkillEntity)
  @ApiInternalServerErrorResponse({ description: 'Server error', type: InternalServerErrorResponse })
  async getSkills(): Promise<SkillEntity[]> {
    return await this.resourcesService.getSkills();
  }

  @Get('skill-experiences')
  @ApiOperation({ summary: "Get system's skill experiences" })
  @ApiOkResponse({
    description: 'Success',
    content: {
      'application-json': {
        schema: {
          properties: {
            code: { type: 'number', default: 1 },
            statusCode: { type: 'number', default: 200 },
            message: { type: 'string' },
            data: { type: 'array', items: { type: 'string' } },
          },
        },
      },
    },
  })
  @ApiInternalServerErrorResponse({ description: 'Server error', type: InternalServerErrorResponse })
  getSkillExperiences(): string[] {
    return this.resourcesService.getSkillExperiences();
  }

  @Get('business-fields')
  @ApiOperation({ summary: "Get system's business fields" })
  @ApplicationArrayApiOkResponse(BusinessField)
  @ApiInternalServerErrorResponse({ description: 'Server error', type: InternalServerErrorResponse })
  async getBusinessFields(): Promise<BusinessField[]> {
    return await this.resourcesService.getBusinessFields();
  }
}
