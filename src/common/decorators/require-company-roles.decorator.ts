import { SetMetadata } from '@nestjs/common';

export const RequireCompanyRole = (...companyRoles: string[]) => SetMetadata('company-roles', companyRoles);
