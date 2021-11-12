import { MigrationInterface, QueryRunner } from 'typeorm';

import { NationalityEntity } from '@Entities/nationality.entity';
import { LanguageEntity } from '@Entities/language.entity';

import rawNationalities from './data/raw_nationalities.json';
import rawLanguages from './data/raw_languages.json';

export class AddSystemData1635701928842 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const nationalityRepository = queryRunner.connection.getRepository(NationalityEntity);
    const oldNationalities = await nationalityRepository.find();
    await nationalityRepository.remove(oldNationalities);

    await nationalityRepository.insert(rawNationalities.map((raw, index) => ({ id: index, name: raw })));

    const languageRespository = queryRunner.connection.getRepository(LanguageEntity);
    const oldLanguages = await languageRespository.find();
    await languageRespository.remove(oldLanguages);
    await languageRespository.insert(rawLanguages.map((raw) => ({ id: raw.alpha2, name: raw.English })));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const languageRespository = queryRunner.connection.getRepository(LanguageEntity);
    const oldLanguages = await languageRespository.find();
    await languageRespository.remove(oldLanguages);

    const nationalityRepository = queryRunner.connection.getRepository(NationalityEntity);
    const oldNationalities = await nationalityRepository.find();
    await nationalityRepository.remove(oldNationalities);
  }
}
