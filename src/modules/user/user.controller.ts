import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { JwtAuthenticationGuard } from '@Modules/authentication/jwt-authentication.guard';

import { CurrentUser } from '@Common/decorators/current-user.decorator';

import { UserEntity } from '@Entities/user.entity';

@ApiTags('user')
@Controller('user')
export class UserController {
  @Get('')
  @ApiBearerAuth('access-token') //edit here
  @UseGuards(JwtAuthenticationGuard)
  getProfile(@CurrentUser() _currentUser: UserEntity): string {
    return 'a';
  }
}
