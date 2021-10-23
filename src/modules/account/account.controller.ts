import { Controller, Post, Put, Body, Query } from '@nestjs/common';

import {
  ApiInternalServerErrorResponse,
  ApiUnauthorizedResponse,
  ApiNotAcceptableResponse,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiForbiddenResponse,
  ApiOperation,
  ApiProperty,
} from '@nestjs/swagger';

import { ApplicationApiOkResponse } from '@Decorators/swagger.decorator';

import {
  InternalServerErrorResponse,
  NotAcceptableResponse,
  UnauthorizedResponse,
  ConflictResponse,
  NotFoundResponse,
  ForbiddenResponse,
} from '@Decorators/swagger.error-responses.decorator';

import { AccountService } from './account.service';

import {
  ChangePasswordRequest,
  RegisterRequest,
  LoginRequest,
} from './dtos/requests.dto';

import {
  ActivateAccountResponse,
  RegisterResponse,
  LoginResponse,
} from './dtos/responses.dto';

@Controller('account')
export class AccountController {
  constructor(private accountService: AccountService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register' })
  @ApplicationApiOkResponse(RegisterResponse)
  @ApiConflictResponse({
    description: 'Email has already been used',
    type: ConflictResponse,
  })
  @ApiInternalServerErrorResponse({
    description: 'Server error',
    type: InternalServerErrorResponse,
  })
  async register(
    @Body() registerRequest: RegisterRequest,
  ): Promise<RegisterResponse> {
    return await this.accountService.register(registerRequest);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login' })
  @ApplicationApiOkResponse(LoginResponse)
  @ApiNotFoundResponse({ description: 'No account', type: NotFoundResponse })
  @ApiUnauthorizedResponse({
    description: 'Wrong password',
    type: UnauthorizedResponse,
  })
  @ApiForbiddenResponse({
    description: 'Account locked',
    type: ForbiddenResponse,
  })
  @ApiInternalServerErrorResponse({
    description: 'Server error',
    type: InternalServerErrorResponse,
  })
  async login(@Body() loginRequest: LoginRequest): Promise<LoginResponse> {
    return await this.accountService.login(loginRequest);
  }

  @Post('activate')
  @ApiOperation({ summary: 'Activate account' })
  @ApplicationApiOkResponse(ActivateAccountResponse)
  @ApiNotFoundResponse({ description: 'No account', type: NotFoundResponse })
  @ApiForbiddenResponse({
    description: 'Wrong activate code',
    type: ForbiddenResponse,
  })
  @ApiInternalServerErrorResponse({
    description: 'Server error',
    type: InternalServerErrorResponse,
  })
  @ApiNotAcceptableResponse({
    description: 'Account had been activated before',
    type: NotAcceptableResponse,
  })
  async activate(
    @Query('token') encryptedString: string,
  ): Promise<ActivateAccountResponse> {
    return await this.accountService.activate(encryptedString);
  }

  @Put('request-reset-password')
  @ApiOperation({ summary: 'Request for reset password' })
  async resetPassword(@Query('email') email: string) {
    // return await this.accountService.requestResetPassword(email);
  }

  // @Post('change-password')
  // async changePassword(
  //   @Query('userId') userId: string,
  //   @Body() changePasswordRequest: ChangePasswordRequest
  // ) {
  //   // return await this.accountService.requestResetPassword(email);
  // }

  @Post('unlock')
  @ApiOperation({ summary: 'Unlock account' })
  async unlock(@Query('token') unlockToken: string) {
    // return await this.accountService.unlock(unlockToken);
  }
}
