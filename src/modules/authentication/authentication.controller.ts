import { Controller, Get, Body } from '@nestjs/common';
import {
  ApiInternalServerErrorResponse,
  ApiUnauthorizedResponse,
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { ApplicationApiOkResponse } from '@Decorators/swagger.decorator';
import { InternalServerErrorResponse, UnauthorizedResponse } from '@Decorators/swagger.error-responses.decorator';

import { AuthenticationService } from './authentication.service';

import { GenerateNewAccessTokenRequest } from './dtos/requests';
import { RefreshAccessTokenResponse } from './dtos/responses';

@ApiTags('authentication')
@Controller('authentication')
export class AuthenticationController {
  constructor(private authenticationService: AuthenticationService) {}

  @Get('refresh-access-token')
  @ApiOperation({ summary: 'Get new access token' })
  @ApiBearerAuth('access-token')
  @ApplicationApiOkResponse(RefreshAccessTokenResponse)
  @ApiUnauthorizedResponse({ description: 'Refresh token expired', type: UnauthorizedResponse })
  @ApiInternalServerErrorResponse({ description: 'Server error', type: InternalServerErrorResponse })
  async generateNewAccessToken(@Body() request: GenerateNewAccessTokenRequest): Promise<RefreshAccessTokenResponse> {
    return await this.authenticationService.generateNewAccessToken(request.token);
  }
}
