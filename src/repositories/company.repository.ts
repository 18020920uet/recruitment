import { EntityRepository, Repository } from 'typeorm';

import { CompanyEntity } from '@Entities/company.entity';

@EntityRepository(CompanyEntity)
export class CompanyRepository extends Repository<CompanyEntity> {}
