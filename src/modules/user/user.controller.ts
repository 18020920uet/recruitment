import { Controller, Get, UseGuards, Put, Body, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { saveAvatarStorage } from '@Common/storages/images.storage';
import { Express } from 'express';

import {
  ApiUnsupportedMediaTypeResponse,
  ApiInternalServerErrorResponse,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiBearerAuth,
  ApiOperation,
  ApiConsumes,
  ApiTags,
} from '@nestjs/swagger';

import {
  UnsupportedMediaTypeResponse,
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

import { ProfileResponse, ChangePasswordResponse, ChangeAvatarResponse } from './dtos/responses';
import {
  ChangeAvatarRequest, ChangePasswordRequest,
  UpdateProfileRequest, UpdateCurriculumnVitaeRequest
} from './dtos/requests';

import { CurriculumVitae } from '@Shared/responses/curriculum-vitae';

import { ApplicationApiOkResponse } from '@Common/decorators/swagger.decorator';

import { UserService } from './user.service';


@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) { }

  @Get('profile')
  @ApiBearerAuth('access-token')
  @ApplicationApiOkResponse(ProfileResponse)
  @ApiUnauthorizedResponse({ description: 'Token expired or no token', type: UnauthorizedResponse })
  @ApiInternalServerErrorResponse({ description: 'Server error', type: InternalServerErrorResponse })
  @UseGuards(JwtAuthenticationGuard)
  async getProfile(@CurrentUser() _currentUser: UserEntity): Promise<ProfileResponse>  {
    return await this.userService.getProfile(_currentUser);
  }

  @Put('change-password')
  @ApiBearerAuth('access-token')
  @ApplicationApiOkResponse(ChangePasswordResponse)
  @ApiInternalServerErrorResponse({ description: 'Server error', type: InternalServerErrorResponse })
  @ApiUnauthorizedResponse({ description: 'Token expired or no token', type: UnauthorizedResponse })
  @ApiForbiddenResponse({ description: 'Wrong password', type: ForbiddenResponse })
  @UseGuards(JwtAuthenticationGuard)
  async changePassword(
    @CurrentUser() _currentUser: UserEntity,
    @Body() changePasswordRequest: ChangePasswordRequest
  ): Promise<ChangePasswordResponse>  {
    return await this.userService.changePassword(_currentUser, changePasswordRequest);
  }

  @Put('profile')
  @ApiBearerAuth('access-token')
  @ApplicationApiOkResponse(ProfileResponse)
  @ApiInternalServerErrorResponse({ description: 'Server error', type: InternalServerErrorResponse })
  @ApiUnauthorizedResponse({ description: 'Token expired or no token', type: UnauthorizedResponse })
  @ApiConflictResponse({ description: 'Email has already been used', type: ConflictResponse })
  @UseGuards(JwtAuthenticationGuard)
  async updateProfile(
   @CurrentUser() _currentUser: UserEntity,
   @Body() updateProfileRequest: UpdateProfileRequest
  ): Promise<ProfileResponse>  {
   return await this.userService.updateProfile(_currentUser, updateProfileRequest);
  }

  @Put('avatar')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthenticationGuard)
  @UseInterceptors(FileInterceptor('file', saveAvatarStorage))
  @ApiConsumes('multipart/form-data')
  @ApplicationApiOkResponse(ChangeAvatarResponse)
  @ApiInternalServerErrorResponse({ description: 'Server error', type: InternalServerErrorResponse })
  @ApiUnauthorizedResponse({ description: 'Token expired or no token', type: UnauthorizedResponse })
  @ApiUnsupportedMediaTypeResponse({ description: 'Wrong file extensions', type: UnsupportedMediaTypeResponse })
  async updateAvatar(
    @CurrentUser() _currentUser: UserEntity,
    @Body() changeAvatarRequest: ChangeAvatarRequest,
    @UploadedFile() file: Express.Multer.File
  ): Promise<ChangeAvatarResponse> {
    return await this.userService.updateAvatar(_currentUser, file);
  }

  @Get('cv')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthenticationGuard)
  @ApplicationApiOkResponse(CurriculumVitae)
  @ApiUnauthorizedResponse({ description: 'Token expired or no token', type: UnauthorizedResponse })
  @ApiInternalServerErrorResponse({ description: 'Server error', type: InternalServerErrorResponse })
  async getCurriculumnVitae(@CurrentUser() _currentUser: UserEntity): Promise<CurriculumVitae> {
    return await this.userService.getCurriculumnVitae(_currentUser);
  }

  @Put('cv')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthenticationGuard)
  @ApplicationApiOkResponse(UpdateCurriculumnVitaeRequest)
  @ApiUnauthorizedResponse({ description: 'Token expired or no token', type: UnauthorizedResponse })
  @ApiInternalServerErrorResponse({ description: 'Server error', type: InternalServerErrorResponse })
  async updateCurriculumnVitae(
    @CurrentUser() _currentUser: UserEntity,
    @Body() updateCurriculumnVitaeRequest: UpdateCurriculumnVitaeRequest
  ): Promise<CurriculumVitae> {
    return await this.userService.updateCurriculumnVitae(_currentUser, updateCurriculumnVitaeRequest);
  }

}
