import { Controller, Get, UseGuards, Put, Body } from '@nestjs/common';
import {
  ApiInternalServerErrorResponse,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import {
  InternalServerErrorResponse,
  UnauthorizedResponse,
  BadRequestResponse,
  ForbiddenResponse,
  ConflictResponse,
  NotFoundResponse,
} from '@Decorators/swagger.error-responses.decorator';

import { JwtAuthenticationGuard } from '@Modules/authentication/jwt-authentication.guard';

import { CurrentUser } from '@Common/decorators/current-user.decorator';

import { UserEntity } from '@Entities/user.entity';

import { ProfileResponse, ChangePasswordResponse } from './dtos/responses';
import { ChangePasswordRequest } from './dtos/requests';

import { ApplicationApiOkResponse } from '@Common/decorators/swagger.decorator';

import { UserService } from './user.service';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) { }

  @Get('profile')
  @ApiBearerAuth('access-token')
  @ApplicationApiOkResponse(ProfileResponse)
  @UseGuards(JwtAuthenticationGuard)
  @ApiUnauthorizedResponse({ description: 'Token expired or no token', type: UnauthorizedResponse })
  @ApiInternalServerErrorResponse({ description: 'Server error', type: InternalServerErrorResponse })
  async getProfile(@CurrentUser() _currentUser: UserEntity): Promise<ProfileResponse>  {
    return await this.userService.getProfile(_currentUser);
  }

  @Put('change-password')
  @ApiBearerAuth('access-token')
  @ApplicationApiOkResponse(ChangePasswordResponse)
  @UseGuards(JwtAuthenticationGuard)
  @ApiInternalServerErrorResponse({ description: 'Server error', type: InternalServerErrorResponse })
  @ApiUnauthorizedResponse({ description: 'Token expired or no token', type: UnauthorizedResponse })
  @ApiForbiddenResponse({ description: 'Wrong password', type: ForbiddenResponse })
  async changePassword(
    @CurrentUser() _currentUser: UserEntity,
    @Body() changePasswordRequest: ChangePasswordRequest
  ): Promise<ChangePasswordResponse>  {
    return await this.userService.changePassword(_currentUser, changePasswordRequest);
  }
}
