import { ApplicationApiOkResponse } from '@Common/decorators/swagger.decorator';
import { InternalServerErrorResponse } from '@Common/decorators/swagger.error-responses.decorator';
import { Controller, Get } from '@nestjs/common';
import { ApiInternalServerErrorResponse, ApiOperation } from '@nestjs/swagger';

import { GetLandingPageResponse } from '@Shared/responses/landing-page';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('landing-page')
  @ApiOperation({ summary: 'Get landing page' })
  @ApplicationApiOkResponse(GetLandingPageResponse)
  @ApiInternalServerErrorResponse({ description: 'Server error', type: InternalServerErrorResponse })
  async getLandingPage(): Promise<GetLandingPageResponse> {
    return await this.appService.getLandingPage();
  }
}
