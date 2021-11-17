import { Controller, Get, Query } from '@nestjs/common';
import { ApiInternalServerErrorResponse, ApiTags } from '@nestjs/swagger';
import { InternalServerErrorResponse } from '@Decorators/swagger.error-responses.decorator';

import { ApplicationArrayApiOkResponse } from '@Common/decorators/swagger.decorator';

import { NationalityEntity } from '@Entities/nationality.entity';
import { LanguageEntity } from '@Entities/language.entity';
import { CountryEntity } from '@Entities/country.entity';
import { AreaEntity } from '@Entities/area.entity';

import { ResourcesService } from './resources.service';

import { GetAreasQuery } from './dtos/requests';

@ApiTags('resources')
@Controller('resources')
export class ResourcesController {
  constructor(private resourcesService: ResourcesService) {}

  @Get('languages')
  @ApplicationArrayApiOkResponse(LanguageEntity)
  @ApiInternalServerErrorResponse({ description: 'Server error', type: InternalServerErrorResponse })
  async getLanguages(): Promise<LanguageEntity[]> {
    return await this.resourcesService.getLanguages();
  }

  @Get('nationnalities')
  @ApplicationArrayApiOkResponse(NationalityEntity)
  @ApiInternalServerErrorResponse({ description: 'Server error', type: InternalServerErrorResponse })
  async getNationnalities(): Promise<NationalityEntity[]> {
    return await this.resourcesService.getNationnalities();
  }

  @Get('countries')
  @ApplicationArrayApiOkResponse(CountryEntity)
  @ApiInternalServerErrorResponse({ description: 'Server error', type: InternalServerErrorResponse })
  async getCountries(): Promise<CountryEntity[]> {
    return await this.resourcesService.getCountries();
  }

  @Get('areas')
  @ApplicationArrayApiOkResponse(AreaEntity)
  @ApiInternalServerErrorResponse({ description: 'Server error', type: InternalServerErrorResponse })
  async getAreasByCountry(@Query() getAreasQuery: GetAreasQuery): Promise<AreaEntity[]> {
    return await this.resourcesService.getAreas(getAreasQuery);
  }
}
