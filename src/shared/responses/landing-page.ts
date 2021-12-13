import { ApiProperty } from '@nestjs/swagger';

export class GetLandingPageResponse {
  @ApiProperty()
  totalJobs: number;

  @ApiProperty()
  totalCompanies: number;

  @ApiProperty()
  totalFreelances: number;

  @ApiProperty()
  totalVerifiedCompanies: number;

  @ApiProperty()
  totalDoneJobs: number;

  @ApiProperty()
  totalInprogressJobs: number;

  @ApiProperty()
  totalWorkingFreelances: number;

  @ApiProperty()
  totalSalaryPaid: number;

  @ApiProperty()
  highestJobSalary: number;

  @ApiProperty()
  opportunityJob: number;
}
