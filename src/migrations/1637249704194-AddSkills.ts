import { MigrationInterface, QueryRunner, Not } from 'typeorm';

import { BusinessFieldEntity } from '@Entities/business-field.entity';
import { SkillEntity } from '@Entities/skill.entity';

import rawSkills from './data/raw_skills.json';

export class AddSkills1637249704194 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const skillRepository = await queryRunner.connection.getRepository(SkillEntity);
    const businessFieldRepository = await queryRunner.connection.getRepository(BusinessFieldEntity);

    const itBusinessField = await businessFieldRepository.find({ name: 'Information Technology' });

    await skillRepository.save(
      rawSkills.map((rawSkill) => {
        const skill = new SkillEntity();
        skill.id = rawSkill.id;
        skill.name = rawSkill.name;
        skill.businessFields = itBusinessField;
        return skill;
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
