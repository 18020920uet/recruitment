import { MigrationInterface, QueryRunner } from 'typeorm';

import { AreaEntity } from '@Entities/area.entity';

import rawAreas from './data/raw_areas.json';

export class AddAreas1636721488030 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const areaRepository = queryRunner.connection.getRepository(AreaEntity);
    await areaRepository.insert(
      rawAreas.map((rawArea) => ({ id: rawArea.id, name: rawArea.name, countryId: rawArea.countryId })),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
