import { Injectable } from '@nestjs/common';
import { getRepository } from 'typeorm';

import { LanguageEntity } from '@Entities/language.entity';
import { NationalityEntity } from '@Entities/nationality.entity';
import { CountryEntity } from '@Entities/country.entity';

@Injectable()
export class ResourcesService {
  async getLanguages(): Promise<LanguageEntity[]> {
    return await getRepository(LanguageEntity).find();
  }

  async getNationnalities(): Promise<NationalityEntity[]> {
    return await getRepository(NationalityEntity).find();
  }

  async getCountries(): Promise<CountryEntity[]> {
    return await getRepository(CountryEntity).find();
  }
}
