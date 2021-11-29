import { EntityRepository, Repository } from 'typeorm';

import { CompanyEmployeeEntity } from '@Entities/company-employee.entity';

@EntityRepository(CompanyEmployeeEntity)
export class CompanyEmployeeRepository extends Repository<CompanyEmployeeEntity> {}
