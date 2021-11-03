import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordRequest {
  @ApiProperty()
  oldPassword: string;

  @ApiProperty()
  newPassword: string;
}

export class UpdateProfileRequest {
  @ApiProperty({ description: 'Các skill tách nhau bởi ký tự "_". Ví dụ: "React Redux_OOP_Problem-solving_"' })
  skills: string;

  @ApiProperty({ minimum: 5, maximum: 150 })
  minimalHourlyRate: number;

  @ApiProperty()
  nationality: number | null;

  @ApiProperty()
  introduce: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;
}

export class ChangeAvatarRequest {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: any;
}
