import { Injectable } from '@nestjs/common';
import { getRepository } from 'typeorm';

import { NationalityEntity } from '@Entities/nationality.entity';
import { LanguageEntity } from '@Entities/language.entity';
import { CountryEntity } from '@Entities/country.entity';
import { SkillEntity } from '@Entities/skill.entity';
import { AreaEntity } from '@Entities/area.entity';

import { GetAreasQuery } from './dtos/requests';

import { JobExperience } from '@Shared/enums/job-experience';

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

  async getAreas(getAreasQuery: GetAreasQuery): Promise<AreaEntity[]> {
    return await getRepository(AreaEntity).find({ countryId: getAreasQuery.countryId });
  }

  async getSkills(): Promise<SkillEntity[]> {
    return await getRepository(SkillEntity).find();
  }

  getSkillExperiences(): string[] {
    return Object.values(JobExperience);
  }
}
