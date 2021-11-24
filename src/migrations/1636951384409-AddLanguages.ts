import { MigrationInterface, QueryRunner } from 'typeorm';

import { LanguageEntity } from '@Entities/language.entity';
import rawLanguages from './data/raw_languages.json';

export class AddLanguages1636951384409 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const languageRespository = queryRunner.connection.getRepository(LanguageEntity);
    await languageRespository.insert(rawLanguages.map((raw) => ({ id: raw.id, name: raw.name })));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
