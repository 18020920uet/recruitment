import { EntityRepository, Repository } from 'typeorm';

import { SkillEntity } from '@Entities/skill.entity';

@EntityRepository(SkillEntity)
export class SkillRepository extends Repository<SkillEntity> {}
