import { Controller, Get } from '@nestjs/common';
import { ApiInternalServerErrorResponse, ApiTags } from '@nestjs/swagger';
import { InternalServerErrorResponse } from '@Decorators/swagger.error-responses.decorator';

import { ApplicationArrayApiOkResponse } from '@Common/decorators/swagger.decorator';

import { LanguageEntity } from '@Entities/language.entity';
import { NationalityEntity } from '@Entities/nationality.entity';
import { CountryEntity } from '@Entities/country.entity';

import { ResourcesService } from './resources.service';

@ApiTags('resources')
@Controller('resources')
export class ResourcesController {
  constructor(private resourcesService: ResourcesService) { }

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
}
