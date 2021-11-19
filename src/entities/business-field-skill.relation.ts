import { PrimaryColumn, Entity } from 'typeorm';

import { JobEntity } from './job.entity';
import { BusinessFieldEntity } from './business-field.entity';

@Entity('business_fields_skills')
export class BusinessFieldSkillRelation {
  @PrimaryColumn({ name: 'business_field_id'})
  businessFieldId: number;

  @PrimaryColumn({ name: 'skill_id' })
  skillId: number;
}
