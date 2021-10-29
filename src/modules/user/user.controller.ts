import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { JwtAuthenticationGuard } from '@Modules/authentication/jwt-authentication.guard';

@ApiTags('user')
@Controller('user')
export class UserController {
  @Get('')
  @ApiBearerAuth('access-token') //edit here
  @UseGuards(JwtAuthenticationGuard)
  getProfile(): string {
    return 'test';
  }
}
