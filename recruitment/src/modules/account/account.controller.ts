import { Controller, Post, Put, Body } from '@nestjs/common';

import { AccountService } from './account.service';

import { RegisterRequest } from './dtos/requests.dto';
import { RegisterResponse } from './dtos/responses.dto';


@Controller('account')
export class AccountController {
  constructor(
    private accountService: AccountService
  ) {}

  @Post('register')
  async register(@Body() registerRequest: RegisterRequest): Promise<RegisterResponse> {
    return await this.accountService.register(registerRequest);
  }

  @Post('login')
  async login() {

  }

  @Post('active')
  async activeAccount() {

  }

  @Put('reset-password')
  async resetPassword() {

  }

  @Post('change-password')
  async changePassword() {

  }
}
