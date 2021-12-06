import { Controller, Get, UseGuards, Param, Query, Put, Body } from '@nestjs/common';
import {
  ApiInternalServerErrorResponse,
  ApiUnauthorizedResponse,
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { InternalServerErrorResponse, UnauthorizedResponse } from '@Decorators/swagger.error-responses.decorator';
import { ApplicationApiOkResponse } from '@Common/decorators/swagger.decorator';
import { CurrentUser } from '@Common/decorators/current-user.decorator';
import { UserEntity } from '@Entities/user.entity';
import { GetUsersQuery, UpdateUserRequest, UserRoleParam } from './dtos/requests';
import { UserInfo, GetUsersResponse } from './dtos/responses';
import { AdminService } from './admin.service';
import { JwtAuthenticationGuard } from '@Common/guard/jwt-authentication.guard';

@ApiTags('admin')
@Controller('admin')
export class AdminController {
  constructor(private adminServices: AdminService) {}

  @Get(':role/users')
  @UseGuards(JwtAuthenticationGuard)
  @ApiOperation({ summary: 'Get users by filter' })
  @ApiBearerAuth('access-token')
  @ApplicationApiOkResponse(GetUsersResponse)
  @ApiUnauthorizedResponse({ description: 'Token expired or no token', type: UnauthorizedResponse })
  @ApiInternalServerErrorResponse({ description: 'Server error', type: InternalServerErrorResponse })
  async getUsers(
    @CurrentUser() _currentUser: UserEntity,
    @Param() userRoleParam: UserRoleParam,
    @Query() getUsersQuery: GetUsersQuery,
  ): Promise<GetUsersResponse> {
    return await this.adminServices.getUsers(_currentUser.role, userRoleParam.role, getUsersQuery);
  }

  @Put('update')
  @UseGuards(JwtAuthenticationGuard)
  @ApiOperation({ summary: 'Update user: active, lock' })
  @ApiBearerAuth('access-token')
  @ApplicationApiOkResponse(GetUsersResponse)
  @ApiUnauthorizedResponse({ description: 'Token expired or no token', type: UnauthorizedResponse })
  @ApiInternalServerErrorResponse({ description: 'Server error', type: InternalServerErrorResponse })
  async updateUsers(
    @CurrentUser() _currentUser: UserEntity,
    @Body() _updateUserRequest: UpdateUserRequest,
  ): Promise<UserInfo> {
    return await this.adminServices.updateUser(_currentUser.role, _updateUserRequest);
  }
}
