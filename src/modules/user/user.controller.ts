import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { JwtAuthenticationGuard } from '@Modules/authentication/jwt-authentication.guard';

@Controller('user')
export class UserController {

  @Get('profile')
  @ApiBearerAuth('access-token') //edit here
  @UseGuards(JwtAuthenticationGuard)
  getProfile(@Request() request): string {
    // console.log(request);
    return 'test';
  }
}
