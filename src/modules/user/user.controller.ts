import { Controller, UseGuards, Put, Body, UploadedFile, UseInterceptors, UploadedFiles, Get, Delete } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import {
  ApiUnsupportedMediaTypeResponse,
  ApiInternalServerErrorResponse,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiBearerAuth,
  ApiOperation,
  ApiConsumes,
  ApiTags,
} from '@nestjs/swagger';

import { saveAvatarStorage } from '@Common/storages/images.storage';
import { saveCertificationsStorage } from '@Common/storages/certifications.storage';

import { JwtAuthenticationGuard } from '@Modules/authentication/jwt-authentication.guard';

import {
  UnsupportedMediaTypeResponse,
  InternalServerErrorResponse,
  ValidationFailResponse,
  UnauthorizedResponse,
  BadRequestResponse,
  ForbiddenResponse,
} from '@Decorators/swagger.error-responses.decorator';
import { ApplicationApiOkResponse } from '@Common/decorators/swagger.decorator';
import { CurrentUser } from '@Common/decorators/current-user.decorator';

import { UserEntity } from '@Entities/user.entity';

import { UpdateCertificationsResponse, ChangePasswordResponse, ChangeAvatarResponse } from './dtos/responses';
import {
  UpdateCurriculumnVitaeRequest,
  RemoveCertificationsRequest,
  UpdateCertificationsRequest,
  UpdateCertificationRequest,
  ChangePasswordRequest,
  ChangeAvatarRequest,
} from './dtos/requests';

import { CurriculumVitae } from '@Shared/responses/curriculum-vitae';
import { User } from '@Shared/responses/user';

import { UserService } from './user.service';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @UseGuards(JwtAuthenticationGuard)
  @ApiOperation({ summary: 'Get current user' })
  @ApiBearerAuth('access-token')
  @ApplicationApiOkResponse(User)
  @ApiUnauthorizedResponse({ description: 'Token expired or no token', type: UnauthorizedResponse })
  @ApiInternalServerErrorResponse({ description: 'Server error', type: InternalServerErrorResponse })
  getCurrentUser(@CurrentUser() _currentUser: UserEntity): User {
    return this.userService.getCurrentUser(_currentUser);
  }

  @Put('change-password')
  @UseGuards(JwtAuthenticationGuard)
  @ApiOperation({ summary: 'Change password' })
  @ApiBearerAuth('access-token')
  @ApplicationApiOkResponse(ChangePasswordResponse)
  @ApiBadRequestResponse({ description: 'Validation fail', type: ValidationFailResponse })
  @ApiForbiddenResponse({ description: 'Wrong password', type: ForbiddenResponse })
  @ApiUnauthorizedResponse({ description: 'Token expired or no token', type: UnauthorizedResponse })
  @ApiInternalServerErrorResponse({ description: 'Server error', type: InternalServerErrorResponse })
  async changePassword(
    @CurrentUser() _currentUser: UserEntity,
    @Body() changePasswordRequest: ChangePasswordRequest,
  ): Promise<ChangePasswordResponse> {
    return await this.userService.changePassword(_currentUser, changePasswordRequest);
  }

  @Put('avatar')
  @UseGuards(JwtAuthenticationGuard)
  @UseInterceptors(FileInterceptor('file', saveAvatarStorage))
  @ApiOperation({ summary: 'Change avatar' })
  @ApiBearerAuth('access-token')
  @ApiConsumes('multipart/form-data')
  @ApplicationApiOkResponse(ChangeAvatarResponse)
  @ApiBadRequestResponse({ description: 'Bad request', type: BadRequestResponse })
  @ApiUnauthorizedResponse({ description: 'Token expired or no token', type: UnauthorizedResponse })
  @ApiInternalServerErrorResponse({ description: 'Server error', type: InternalServerErrorResponse })
  @ApiUnsupportedMediaTypeResponse({ description: 'Wrong file extensions', type: UnsupportedMediaTypeResponse })
  async updateAvatar(
    @CurrentUser() _currentUser: UserEntity,
    @Body() changeAvatarRequest: ChangeAvatarRequest,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ChangeAvatarResponse> {
    return await this.userService.updateAvatar(_currentUser, file);
  }

  @Put('cv')
  @UseGuards(JwtAuthenticationGuard)
  @ApiOperation({ summary: 'Update cv' })
  @ApiBearerAuth('access-token')
  @ApplicationApiOkResponse(CurriculumVitae)
  @ApiBadRequestResponse({ description: 'Validation fail', type: ValidationFailResponse })
  @ApiUnauthorizedResponse({ description: 'Token expired or no token', type: UnauthorizedResponse })
  @ApiInternalServerErrorResponse({ description: 'Server error', type: InternalServerErrorResponse })
  async updateCurriculumnVitae(
    @CurrentUser() _currentUser: UserEntity,
    @Body() updateCurriculumnVitaeRequest: UpdateCurriculumnVitaeRequest,
  ): Promise<CurriculumVitae> {
    return await this.userService.updateCurriculumnVitae(_currentUser, updateCurriculumnVitaeRequest);
  }

  @Put('certifications')
  @UseGuards(JwtAuthenticationGuard)
  @UseInterceptors(FilesInterceptor('files', 3, saveCertificationsStorage))
  @ApiOperation({ summary: 'Update/Replace certifications' })
  @ApiBearerAuth('access-token')
  @ApiConsumes('multipart/form-data')
  @ApplicationApiOkResponse(UpdateCertificationsResponse)
  @ApiBadRequestResponse({ description: 'Bad request', type: BadRequestResponse })
  @ApiUnauthorizedResponse({ description: 'Token expired or no token', type: UnauthorizedResponse })
  @ApiInternalServerErrorResponse({ description: 'Server error', type: InternalServerErrorResponse })
  @ApiUnsupportedMediaTypeResponse({ description: 'Wrong file extensions', type: UnsupportedMediaTypeResponse })
  async updateCertifications(
    @CurrentUser() _currentUser: UserEntity,
    @Body() updateCertificationsRequest: UpdateCertificationsRequest,
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<UpdateCertificationsResponse> {
    return await this.userService.updateCertifications(_currentUser, files);
  }

  @Put('certification')
  @UseGuards(JwtAuthenticationGuard)
  @UseInterceptors(FileInterceptor('file', saveCertificationsStorage))
  @ApiOperation({ summary: 'Add certification' })
  @ApiBearerAuth('access-token')
  @ApiConsumes('multipart/form-data')
  @ApplicationApiOkResponse(UpdateCertificationsResponse)
  @ApiBadRequestResponse({ description: 'Bad request', type: BadRequestResponse })
  @ApiForbiddenResponse({ description: 'Total certifications > 3', type: ForbiddenResponse })
  @ApiUnauthorizedResponse({ description: 'Token expired or no token', type: UnauthorizedResponse })
  @ApiInternalServerErrorResponse({ description: 'Server error', type: InternalServerErrorResponse })
  @ApiUnsupportedMediaTypeResponse({ description: 'Wrong file extensions', type: UnsupportedMediaTypeResponse })
  async updateCertification(
    @CurrentUser() _currentUser: UserEntity,
    @Body() updateCertificationRequest: UpdateCertificationRequest,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<UpdateCertificationsResponse> {
    return await this.userService.updateCertification(_currentUser, file);
  }

  @Delete('certifications')
  @UseGuards(JwtAuthenticationGuard)
  @ApiOperation({ summary: 'Remove certifications' })
  @ApiBearerAuth('access-token')
  @ApplicationApiOkResponse(UpdateCertificationsResponse)
  @ApiBadRequestResponse({ description: 'Bad request', type: BadRequestResponse })
  @ApiForbiddenResponse({ description: 'No permission', type: ForbiddenResponse })
  @ApiUnauthorizedResponse({ description: 'Token expired or no token', type: UnauthorizedResponse })
  @ApiInternalServerErrorResponse({ description: 'Server error', type: InternalServerErrorResponse })
  async removeCertification(
    @CurrentUser() _currentUser: UserEntity,
    @Body() removeCertificationsRequest: RemoveCertificationsRequest,
  ): Promise<UpdateCertificationsResponse> {
    return await this.userService.removeCertifications(_currentUser, removeCertificationsRequest);
  }
}
