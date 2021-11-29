import { SetMetadata } from '@nestjs/common';

export const RequireRole = (role: number) => SetMetadata('role', role);
