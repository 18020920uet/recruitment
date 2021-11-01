import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { JwtAuthenticationGuard } from '@Modules/authentication/jwt-authentication.guard';

import { CurrentUser } from '@Common/decorators/current-user.decorator';

import { UserEntity } from '@Entities/user.entity';

import { GetProfileResponse } from './dtos/responses';
import { ApplicationApiOkResponse } from '@Common/decorators/swagger.decorator';

import { UserService } from './user.service';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) { }

  @Get('profile')
  @ApiBearerAuth('access-token')
  @ApplicationApiOkResponse(GetProfileResponse)
  @UseGuards(JwtAuthenticationGuard)
  async getProfile(@CurrentUser() _currentUser: UserEntity): Promise<GetProfileResponse>  {
    return this.userService.getProfile(_currentUser);
  }
}
