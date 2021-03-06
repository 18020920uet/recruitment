import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { UserEntity } from '@Entities/user.entity';

@Injectable()
export class CompanyGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requireRole = this.reflector.get<number>('role', context.getHandler());

    const request = context.switchToHttp().getRequest();
    const user: UserEntity = request.user;

    if (user.role == requireRole && user.employeeOfCompany != null) {
      request.companyRole = user.employeeOfCompany.role;
      request.company = user.employeeOfCompany.company;
      return true;
    }
    return false;
  }
}
