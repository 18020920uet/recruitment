import { Injectable } from '@nestjs/common';
import { getRepository } from 'typeorm';

import { NationalityEntity } from '@Entities/nationality.entity';
import { LanguageEntity } from '@Entities/language.entity';
import { CountryEntity } from '@Entities/country.entity';
import { StateEntity } from '@Entities/state.entity';
import { CityEntity } from '@Entities/city.entity';

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

  async getStates(countryId: number): Promise<StateEntity[]> {
    return await getRepository(StateEntity).find({ countryId: countryId });
  }

  async getCities(countryId: number | null, stateId: number | null): Promise<CityEntity[]> {
    console.log(stateId);
    if (stateId == null) {
      return await getRepository(CityEntity).find({ countryId: countryId });
    } else {
      return await getRepository(CityEntity).find({ countryId: countryId, stateId: stateId });
    }
  }
}
