import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { UserEntity } from '@Entities/user.entity';

@Injectable()
export class FreelanceGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requireRole = this.reflector.get<number>('role', context.getHandler());
    const request = context.switchToHttp().getRequest();
    const user: UserEntity = request.user;
    return user.role == requireRole;
  }
}
