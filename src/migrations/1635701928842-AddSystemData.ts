import { MigrationInterface, QueryRunner } from 'typeorm';

import { CountryEntity } from '@Entities/country.entity';
import { NationalityEntity } from '@Entities/nationality.entity';
import { LanguageEntity } from '@Entities/language.entity';

import rawNationalities from './data/raw_nationalities.json';
import rawCountries from './data/raw_countries.json';
import rawLanguages from './data/raw_languages.json';

export class AddSystemData1635701928842 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const countryRepository = queryRunner.connection.getRepository(CountryEntity);
    await countryRepository.insert(rawCountries.map((raw) => ({ id: raw.code, name: raw.name })));

    const nationalityRepository = queryRunner.connection.getRepository(NationalityEntity);
    await nationalityRepository.insert(rawNationalities.map((raw, index) => ({ id: index, name: raw })));

    const languageRespository = queryRunner.connection.getRepository(LanguageEntity);
    await languageRespository.insert(rawLanguages.map((raw) => ({ id: raw.alpha2, name: raw.English })));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
