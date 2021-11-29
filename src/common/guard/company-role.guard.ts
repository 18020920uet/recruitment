import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { CompanyEntity } from '@Entities/company.entity';

import { CompanyRole } from '@Shared/enums/company-role';

@Injectable()
export class CompanyRoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requireCompanyRoles = this.reflector.get<string[]>('company-roles', context.getHandler());

    const request = context.switchToHttp().getRequest();
    const _currentCompany: CompanyEntity = request.company;
    const _currentRoleOfEmployeeInCompany: CompanyRole = request.companyRole;

    if (_currentCompany != null && requireCompanyRoles.includes(_currentRoleOfEmployeeInCompany)) {
      return true;
    }

    return false;
  }
}
