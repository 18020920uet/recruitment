import { Controller, Get, Query } from '@nestjs/common';
import { ApiInternalServerErrorResponse, ApiTags } from '@nestjs/swagger';
import { InternalServerErrorResponse } from '@Decorators/swagger.error-responses.decorator';

import { ApplicationArrayApiOkResponse } from '@Common/decorators/swagger.decorator';

import { NationalityEntity } from '@Entities/nationality.entity';
import { LanguageEntity } from '@Entities/language.entity';
import { CountryEntity } from '@Entities/country.entity';
import { StateEntity } from '@Entities/state.entity';
import { CityEntity } from '@Entities/city.entity';

import { ResourcesService } from './resources.service';

import { GetStatesQuery, GetCitiesQuery } from './dtos/requests';

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

  @Get('states')
  @ApplicationArrayApiOkResponse(StateEntity)
  @ApiInternalServerErrorResponse({ description: 'Server error', type: InternalServerErrorResponse })
  async getStatesByCountry(@Query() getStatesQuery: GetStatesQuery): Promise<StateEntity[]> {
    return await this.resourcesService.getStates(getStatesQuery.countryId);
  }

  @Get('cities')
  @ApplicationArrayApiOkResponse(CityEntity)
  @ApiInternalServerErrorResponse({ description: 'Server error', type: InternalServerErrorResponse })
  async getCitiesByState(@Query() getCitiesQuery: GetCitiesQuery): Promise<CityEntity[]> {
    return await this.resourcesService.getCities(getCitiesQuery.countryId, getCitiesQuery.stateId);
  }
}
