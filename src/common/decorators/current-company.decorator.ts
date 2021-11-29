import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentCompany = createParamDecorator((field: string, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const company = request.company;
  return field ? company?.[field] : company;
});
