import { PrimaryColumn, Entity } from 'typeorm';

import { JobEntity } from './job.entity';
import { SkillEntity} from './skill.entity';

@Entity('jobs_skills')
export class JobSkillRelation {
  @PrimaryColumn({ name: 'job_id' })
  jobId: number;

  @PrimaryColumn({ name: 'skill_id' })
  skillId: number;
}
