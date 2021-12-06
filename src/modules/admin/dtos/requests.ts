import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, Min, Max, IsOptional, IsNumber, IsBoolean, IsEnum } from 'class-validator';
import { Type, Transform } from 'class-transformer';

import { JobExperience } from '@Shared/enums/job-experience';
import { Role } from '@Shared/enums/role';

type OrderBy = 'name' | 'is_activated' | 'is_lock';
type SortBy = 'ASC' | 'DESC';

export class UserRoleParam {
  @IsNotEmpty()
  @ApiProperty({ type: 'number', required: true, description: '0 = ADMIN, 1 = COMPANY, 2 = FREELANCE' })
  role: Role;
}

export class GetUsersQuery {
  @IsOptional()
  @ApiProperty({ type: 'string', required: false })
  name: string | null;

  @IsOptional()
  @ApiProperty({ type: 'boolean', required: false })
  is_activated: boolean | null;

  @IsOptional()
  @ApiProperty({ type: 'boolean', required: false })
  is_lock: boolean | null;

  @IsOptional()
  @ApiProperty({ type: 'string', required: false, description: 'name | is_activated | is_lock' })
  order_by: OrderBy | null;

  @IsOptional()
  @ApiProperty({ type: 'string', required: false, description: 'ASC | DESC' })
  sort_by: SortBy | null;

  @Type(() => Number)
  @Min(1)
  @ApiProperty({ type: 'number', minimum: 1, description: 'page > 1' })
  page: number;

  @Type(() => Number)
  @Min(1)
  @IsOptional()
  @ApiProperty({ type: 'number', required: false, minimum: 1, description: 'Auto = 10, records > 0' })
  records: number;
}

export class UpdateUserRequest {
  @Type(() => String)
  @ApiProperty({ type: 'string', required: true })
  id: string | null;

  @IsOptional()
  @ApiProperty({ type: 'boolean', required: false })
  isActivated: boolean | null;

  @IsOptional()
  @ApiProperty({ type: 'boolean', required: false })
  isLock: boolean | null;
}
