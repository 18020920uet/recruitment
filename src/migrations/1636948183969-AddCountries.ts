import { MigrationInterface, QueryRunner } from 'typeorm';

import { CountryEntity } from '@Entities/country.entity';

import rawCountries from './data/raw_countries.json';

export class AddCountries1636948183969 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const countryRepository = queryRunner.connection.getRepository(CountryEntity);
    await countryRepository.save(
      rawCountries.map((rawCountry) => ({
        id: rawCountry.id,
        name: rawCountry.name,
        emoji: rawCountry.emoji,
      })),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const countryRepository = queryRunner.connection.getRepository(CountryEntity);
    await countryRepository.clear();
  }
}
