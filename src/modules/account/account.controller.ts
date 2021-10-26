import { Controller, Post, Put, Body, Query } from '@nestjs/common';

import {
  ApiInternalServerErrorResponse,
  ApiNotAcceptableResponse,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
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
  BadRequestResponse,
  ForbiddenResponse,
  ConflictResponse,
  NotFoundResponse,
} from '@Decorators/swagger.error-responses.decorator';

import { AccountService } from './account.service';

import {
  ChangePasswordRequest,
  RegisterRequest,
  LoginRequest,
} from './dtos/requests.dto';

import {
  RequestResetPasswordResponse,
  ActivateAccountResponse,
  UnlockAccountResponse,
  RegisterResponse,
  LoginResponse,
} from './dtos/responses.dto';

@Controller('account')
export class AccountController {
  constructor(private accountService: AccountService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register' })
  @ApplicationApiOkResponse(RegisterResponse)
  @ApiConflictResponse({ description: 'Email has already been used', type: ConflictResponse })
  @ApiInternalServerErrorResponse({ description: 'Server error', type: InternalServerErrorResponse })
  async register(@Body() registerRequest: RegisterRequest): Promise<RegisterResponse> {
    return await this.accountService.register(registerRequest);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login' })
  @ApplicationApiOkResponse(LoginResponse)
  @ApiNotFoundResponse({ description: 'No account', type: NotFoundResponse })
  @ApiUnauthorizedResponse({ description: 'Wrong password', type: UnauthorizedResponse })
  @ApiForbiddenResponse({ description: 'Account locked', type: ForbiddenResponse })
  @ApiInternalServerErrorResponse({ description: 'Server error', type: InternalServerErrorResponse })
  async login(@Body() loginRequest: LoginRequest): Promise<LoginResponse> {
    return await this.accountService.login(loginRequest);
  }

  @Post('activate')
  @ApiOperation({ summary: 'Activate account' })
  @ApplicationApiOkResponse(ActivateAccountResponse)
  @ApiNotFoundResponse({ description: 'No account', type: NotFoundResponse })
  @ApiForbiddenResponse({ description: 'Wrong activate code', type: ForbiddenResponse })
  @ApiBadRequestResponse({ description: 'Already activated', type: BadRequestResponse })
  @ApiInternalServerErrorResponse({ description: 'Server error', type: InternalServerErrorResponse })
  async activate(@Query('token') encryptedString: string): Promise<ActivateAccountResponse> {
    return await this.accountService.activate(encryptedString);
  }

  @Put('request-reset-password')
  @ApiOperation({ summary: 'Request for reset password' })
  @ApplicationApiOkResponse(RequestResetPasswordResponse)
  @ApiNotFoundResponse({ description: 'No account', type: NotFoundResponse })
  @ApiInternalServerErrorResponse({ description: 'Server error', type: InternalServerErrorResponse })
  async resetPassword(@Query('email') email: string): Promise<RequestResetPasswordResponse> {
    return await this.accountService.requestResetPassword(email);
  }

  @Post('unlock')
  @ApiOperation({ summary: 'Unlock account' })
  @ApplicationApiOkResponse(UnlockAccountResponse)
  @ApiNotFoundResponse({ description: 'No account', type: NotFoundResponse })
  @ApiForbiddenResponse({ description: 'Wrong unlock code', type: ForbiddenResponse })
  @ApiBadRequestResponse({ description: 'Already unlocked', type: BadRequestResponse })
  @ApiInternalServerErrorResponse({ description: 'Server error', type: InternalServerErrorResponse })
  async unlock(@Query('token') unlockToken: string): Promise<UnlockAccountResponse> {
    return await this.accountService.unlock(unlockToken);
  }
}
