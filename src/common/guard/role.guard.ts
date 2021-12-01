import { CanActivate, ExecutionContext, Injectable, Inject, forwardRef } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { UserEntity } from '@Entities/user.entity';

import { Role } from '@Shared/enums/role';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user: UserEntity = request.user;
    if (user.role == Role.COMPANY && user.employeeOfCompany != null) {
      request.companyRole = user.employeeOfCompany.role;
      request.company = user.employeeOfCompany.company;
      return true;
    } else if (user.role == Role.FREELANCE || user.role == Role.ADMIN) {
      return true;
    }
    return false;
  }
}
