import { Injectable } from '@nestjs/common';
import { getRepository } from 'typeorm';

import { BusinessFieldEntity } from '@Entities/business-field.entity';
import { NationalityEntity } from '@Entities/nationality.entity';
import { LanguageEntity } from '@Entities/language.entity';
import { CountryEntity } from '@Entities/country.entity';
import { SkillEntity } from '@Entities/skill.entity';
import { AreaEntity } from '@Entities/area.entity';

import { GetAreasQueries } from './dtos/requests';

import { JobExperience } from '@Shared/enums/job-experience';
import { BusinessField } from '@Shared/responses/business-field';

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

  async getAreas(getAreasQueries: GetAreasQueries): Promise<AreaEntity[]> {
    return await getRepository(AreaEntity).find({ countryId: getAreasQueries.countryId });
  }

  async getSkills(): Promise<SkillEntity[]> {
    return await getRepository(SkillEntity).find();
  }

  getSkillExperiences(): string[] {
    return Object.values(JobExperience);
  }

  async getBusinessFields(): Promise<BusinessField[]> {
    const _businessFields = await getRepository(BusinessFieldEntity).find();
    return _businessFields.map(_businessField => ({ id: _businessField.id, name: _businessField.name }));
  }
}
