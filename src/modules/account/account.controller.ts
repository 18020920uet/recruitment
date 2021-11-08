import { Controller, Post, Put, Body, Query, HttpCode } from '@nestjs/common';

import {
  ApiInternalServerErrorResponse,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiForbiddenResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { ApplicationApiOkResponse, ApplicationApiCreateResponse } from '@Decorators/swagger.decorator';

import {
  InternalServerErrorResponse,
  UnauthorizedResponse,
  BadRequestResponse,
  ForbiddenResponse,
  ConflictResponse,
  NotFoundResponse,
} from '@Decorators/swagger.error-responses.decorator';

import { AccountService } from './account.service';

import { RegisterRequest, LoginRequest, ActivateRequest, UnlockRequest } from './dtos/requests';

import { RequestResetPasswordResponse, AccountResponse } from './dtos/responses';

@ApiTags('account')
@Controller('account')
export class AccountController {
  constructor(private accountService: AccountService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register' })
  @ApplicationApiCreateResponse(AccountResponse)
  @ApiBadRequestResponse({ description: 'Bad request', type: BadRequestResponse })
  @ApiConflictResponse({ description: 'Email has already been used', type: ConflictResponse })
  @ApiInternalServerErrorResponse({ description: 'Server error', type: InternalServerErrorResponse })
  async register(@Body() registerRequest: RegisterRequest): Promise<AccountResponse> {
    return await this.accountService.register(registerRequest);
  }

  @Post('login')
  @HttpCode(200)
  @ApiOperation({ summary: 'Login' })
  @ApplicationApiOkResponse(AccountResponse)
  @ApiNotFoundResponse({ description: 'No account', type: NotFoundResponse })
  @ApiBadRequestResponse({ description: 'Bad request', type: BadRequestResponse })
  @ApiUnauthorizedResponse({ description: 'Wrong password', type: UnauthorizedResponse })
  @ApiForbiddenResponse({ description: 'Account locked', type: ForbiddenResponse })
  @ApiInternalServerErrorResponse({ description: 'Server error', type: InternalServerErrorResponse })
  async login(@Body() loginRequest: LoginRequest): Promise<AccountResponse> {
    return await this.accountService.login(loginRequest);
  }

  @Put('activate')
  @ApiOperation({ summary: 'Activate account' })
  @ApplicationApiOkResponse(AccountResponse)
  @ApiNotFoundResponse({ description: 'No account', type: NotFoundResponse })
  @ApiBadRequestResponse({ description: 'Bad request', type: BadRequestResponse })
  @ApiForbiddenResponse({ description: 'Wrong activate code', type: ForbiddenResponse })
  @ApiBadRequestResponse({ description: 'Already activated', type: BadRequestResponse })
  @ApiInternalServerErrorResponse({ description: 'Server error', type: InternalServerErrorResponse })
  async activate(@Body() activateRequest: ActivateRequest): Promise<AccountResponse> {
    return await this.accountService.activate(activateRequest.token);
  }

  @Post('request-reset-password')
  @ApiOperation({ summary: 'Request for reset password' })
  @ApplicationApiCreateResponse(RequestResetPasswordResponse)
  @ApiNotFoundResponse({ description: 'No account', type: NotFoundResponse })
  @ApiBadRequestResponse({ description: 'Bad request', type: BadRequestResponse })
  @ApiInternalServerErrorResponse({ description: 'Server error', type: InternalServerErrorResponse })
  async resetPassword(@Query('email') email: string): Promise<RequestResetPasswordResponse> {
    return await this.accountService.requestResetPassword(email);
  }

  @Put('unlock')
  @ApiOperation({ summary: 'Unlock account' })
  @ApplicationApiOkResponse(AccountResponse)
  @ApiNotFoundResponse({ description: 'No account', type: NotFoundResponse })
  @ApiBadRequestResponse({ description: 'Bad request', type: BadRequestResponse })
  @ApiForbiddenResponse({ description: 'Wrong unlock code', type: ForbiddenResponse })
  @ApiBadRequestResponse({ description: 'Already unlocked', type: BadRequestResponse })
  @ApiInternalServerErrorResponse({ description: 'Server error', type: InternalServerErrorResponse })
  async unlock(@Body() unlockRequest: UnlockRequest): Promise<AccountResponse> {
    return await this.accountService.unlock(unlockRequest.token);
  }
}
