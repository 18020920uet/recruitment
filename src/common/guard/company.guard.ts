import { CanActivate, ExecutionContext, Injectable, Inject, forwardRef } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { UserEntity } from '@Entities/user.entity';

import { AuthenticationService } from '@Modules/authentication/authentication.service';

@Injectable()
export class CompanyGuard implements CanActivate {
  constructor(
    @Inject(forwardRef(() => AuthenticationService)) private authenticationService: AuthenticationService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requireRole = this.reflector.get<number>('role', context.getHandler());

    const request = context.switchToHttp().getRequest();
    const user: UserEntity = request.user;

    if (user.role == requireRole) {
      const _currentEmployee = await this.authenticationService.validateCompanyEmployee(user.id);
      const company = _currentEmployee.company;
      request.companyRole = _currentEmployee.role;
      request.company = company;
      return true;
    }
    return false;
  }
}
