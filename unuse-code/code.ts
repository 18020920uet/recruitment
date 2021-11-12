// export class UpdateProfileRequest {
//   @IsString()
//   @ApiProperty({ type: [String] })
//   skills: string[];
//
//   @IsPositive()
//   @Min(5)
//   @Max(150)
//   @ApiProperty({ minimum: 5, maximum: 150 })
//   minimalHourlyRate: number;
//
//   @IsPositive()
//   @ApiProperty()
//   nationality: number | null;
//
//   @IsString()
//   @ApiProperty()
//   introduce: string;
//
//   @IsEmail()
//   @IsNotEmpty()
//   @ApiProperty()
//   email: string;
//
//   @IsNotEmpty()
//   @IsString()
//   @ApiProperty()
//   firstName: string;
//
//   @IsNotEmpty()
//   @IsString()
//   @ApiProperty()
//   lastName: string;
// }

// async updateProfile(_currentUser: UserEntity, updateProfileRequest: UpdateProfileRequest): Promise<ProfileResponse> {
//   const _cv = await this.curriculumnVitaeRepository.findOne({ where: { user: _currentUser } });
//
//   await getManager().transaction(async (transactionalEntityManager) => {
//     if (_currentUser.email != updateProfileRequest.email) {
//       const email = updateProfileRequest.email;
//       const userWithEmail = await this.userRepository.find({ email: email });
//
//       if (userWithEmail) {
//         throw new ConflictException('Email has been used');
//       }
//
//       // TO DO SEND MAIL TO CONFIRM;
//     }
//
//     _currentUser.firstName = updateProfileRequest.firstName;
//     _currentUser.lastName = updateProfileRequest.lastName;
//
//     _cv.introduce = updateProfileRequest.introduce;
//     _cv.minimalHourlyRate = updateProfileRequest.minimalHourlyRate;
//     _cv.skills = updateProfileRequest.skills;
//     _cv.nationality = updateProfileRequest.nationality;
//
//     await transactionalEntityManager.save(_currentUser);
//     await transactionalEntityManager.save(_cv);
//   });
//
//   return await this.mapper.map(_cv, ProfileResponse, CurriculumVitaeEntity);
// }

// @Get('profile')
// @ApiBearerAuth('access-token')
// @ApplicationApiOkResponse(ProfileResponse)
// @ApiUnauthorizedResponse({ description: 'Token expired or no token', type: UnauthorizedResponse })
// @ApiInternalServerErrorResponse({ description: 'Server error', type: InternalServerErrorResponse })
// @UseGuards(JwtAuthenticationGuard)
// async getProfile(@CurrentUser() _currentUser: UserEntity): Promise<ProfileResponse> {
//   return await this.userService.getProfile(_currentUser);
// }


  // @Put('profile')
  // @ApiBearerAuth('access-token')
  // @ApplicationApiOkResponse(ProfileResponse)
  // @ApiBadRequestResponse({ description: 'Validation fail', type: ValidationFailResponse })
  // @ApiConflictResponse({ description: 'Email has already been used', type: ConflictResponse })
  // @ApiUnauthorizedResponse({ description: 'Token expired or no token', type: UnauthorizedResponse })
  // @ApiInternalServerErrorResponse({ description: 'Server error', type: InternalServerErrorResponse })
  // @UseGuards(JwtAuthenticationGuard)
  // async updateProfile(
  //   @CurrentUser() _currentUser: UserEntity,
  //   @Body() updateProfileRequest: UpdateProfileRequest,
  // ): Promise<ProfileResponse> {
  //   return await this.userService.updateProfile(_currentUser, updateProfileRequest);
  // }

  // mapper.createMap(CurriculumVitaeEntity, ProfileResponse)
  //   .forMember(
  //     (profile) => profile.avatar,
  //     mapFrom((_curriculumVitae) => this.fileService.getAvatar(_curriculumVitae.user))
  //   );
// async getProfile(_currentUser: UserEntity): Promise<ProfileResponse> {
//   const _cv = await this.curriculumnVitaeRepository.findOne({
//     where: { user: _currentUser },
//     relations: ['user'],
//   });
//   return await this.mapper.map(_cv, ProfileResponse, CurriculumVitaeEntity);
// }
