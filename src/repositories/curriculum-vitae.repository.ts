import { EntityRepository, Repository } from 'typeorm';

import { CurriculumVitaeEntity } from '@Entities/curriculum-vitae.entity';

@EntityRepository(CurriculumVitaeEntity)
export class CurriculumVitaeRepository extends Repository<CurriculumVitaeEntity> {}
