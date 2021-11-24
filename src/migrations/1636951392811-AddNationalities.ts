import { MigrationInterface, QueryRunner } from 'typeorm';

import { NationalityEntity } from '@Entities/nationality.entity';

import rawNationalities from './data/raw_nationalities.json';

export class AddNationalities1636951392811 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const nationalityRepository = queryRunner.connection.getRepository(NationalityEntity);
    await nationalityRepository.insert(rawNationalities.map((raw) => ({ id: raw.id, name: raw.name })));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
