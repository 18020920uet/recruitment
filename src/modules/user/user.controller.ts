import {
  Controller,
  Get,
  UseGuards,
  Put,
  Body,
  UploadedFile,
  UseInterceptors,
  Query,
  UploadedFiles,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import {
  ApiUnsupportedMediaTypeResponse,
  ApiInternalServerErrorResponse,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiTags,
} from '@nestjs/swagger';

import { saveAvatarStorage } from '@Common/storages/images.storage';
import { saveCertificationsStorage } from '@Common/storages/certifications.storage';

import {
  UnsupportedMediaTypeResponse,
  InternalServerErrorResponse,
  ValidationFailResponse,
  UnauthorizedResponse,
  BadRequestResponse,
  ForbiddenResponse,
} from '@Decorators/swagger.error-responses.decorator';

import { JwtAuthenticationGuard } from '@Modules/authentication/jwt-authentication.guard';

import { CurrentUser } from '@Common/decorators/current-user.decorator';
import { ApplicationApiOkResponse, ApplicationArrayApiOkResponse } from '@Common/decorators/swagger.decorator';

import { UserEntity } from '@Entities/user.entity';

import { UpdateCertificationsResponse, ChangePasswordResponse, ChangeAvatarResponse } from './dtos/responses';
import {
  UpdateCurriculumnVitaeRequest,
  UpdateCertificationsRequest,
  ChangePasswordRequest,
  ChangeAvatarRequest,
} from './dtos/requests';

import { CurriculumVitae } from '@Shared/responses/curriculum-vitae';

import { UserService } from './user.service';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Put('change-password')
  @ApiBearerAuth('access-token')
  @ApplicationApiOkResponse(ChangePasswordResponse)
  @ApiBadRequestResponse({ description: 'Validation fail', type: ValidationFailResponse })
  @ApiForbiddenResponse({ description: 'Wrong password', type: ForbiddenResponse })
  @ApiUnauthorizedResponse({ description: 'Token expired or no token', type: UnauthorizedResponse })
  @ApiInternalServerErrorResponse({ description: 'Server error', type: InternalServerErrorResponse })
  @UseGuards(JwtAuthenticationGuard)
  async changePassword(
    @CurrentUser() _currentUser: UserEntity,
    @Body() changePasswordRequest: ChangePasswordRequest,
  ): Promise<ChangePasswordResponse> {
    return await this.userService.changePassword(_currentUser, changePasswordRequest);
  }

  @Put('avatar')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthenticationGuard)
  @UseInterceptors(FileInterceptor('file', saveAvatarStorage))
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
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthenticationGuard)
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
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthenticationGuard)
  @UseInterceptors(FilesInterceptor('files', 3, saveCertificationsStorage))
  @ApiConsumes('multipart/form-data')
  @ApplicationApiOkResponse(UpdateCertificationsResponse)
  @ApiBadRequestResponse({ description: 'Bad request', type: BadRequestResponse })
  @ApiUnauthorizedResponse({ description: 'Token expired or no token', type: UnauthorizedResponse })
  @ApiInternalServerErrorResponse({ description: 'Server error', type: InternalServerErrorResponse })
  @ApiUnsupportedMediaTypeResponse({ description: 'Wrong file extensions', type: UnsupportedMediaTypeResponse })
  async updateCertifications(
    @CurrentUser() _currentUser: UserEntity,
    @Body() addCertificationRequest: UpdateCertificationsRequest,
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<UpdateCertificationsResponse> {
    return await this.userService.updateCertifications(_currentUser, files);
  }
}
