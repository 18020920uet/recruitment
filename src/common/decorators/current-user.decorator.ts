import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserEntity } from '@Entities/user.entity';

export const CurrentUser = createParamDecorator((data: UserEntity, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return request.user;
});
