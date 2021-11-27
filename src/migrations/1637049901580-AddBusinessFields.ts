import { MigrationInterface, QueryRunner } from 'typeorm';

import { BusinessFieldEntity } from '@Entities/business-field.entity';

import rawbusinessFields from './data/raw_business-fields.json';

export class AddBusinessFields1637049901580 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const businessFieldRepository = queryRunner.connection.getRepository(BusinessFieldEntity);

    await businessFieldRepository.insert(
      rawbusinessFields.map((rawbusinessField) => {
        return {
          name: rawbusinessField.name,
          description: rawbusinessField.description,
        };
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const businessFieldRepository = queryRunner.connection.getRepository(BusinessFieldEntity);
    await businessFieldRepository.clear();
  }
}
