import { MigrationInterface, QueryRunner } from 'typeorm';

import { StateEntity } from '@Entities/state.entity';

import rawStates from './data/raw_states.json';

export class AddCountriesStatesCities1636721488030 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const stateRepository = queryRunner.connection.getRepository(StateEntity);
    await stateRepository.insert(
      rawStates.map(rawState => ({ id: rawState.id, name: rawState.name, countryId: rawState.countryId }))
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
  }
}
