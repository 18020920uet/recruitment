import { Injectable } from '@nestjs/common';
import { getManager, In, Not } from 'typeorm';

import { JobEmployeeRepositoty } from '@Repositories/job-employee.repository';
import { CompanyRepository } from '@Repositories/company.repository';
import { UserRepository } from '@Repositories/user.repository';
import { JobRepository } from '@Repositories/job.repository';

import { JobEmployeeStatus } from '@Shared/enums/job-employee-status';
import { JobStatus } from '@Shared/enums/job-status';
import { Role } from '@Shared/enums/role';

import { GetLandingPageResponse } from '@Shared/responses/landing-page';

@Injectable()
export class AppService {
  constructor(
    private jobEmployeeRepositoty: JobEmployeeRepositoty,
    private companyRepository: CompanyRepository,
    private userRepository: UserRepository,
    private jobRepository: JobRepository,
  ) {}

  async getLandingPage(): Promise<GetLandingPageResponse> {
    const response = new GetLandingPageResponse();

    const doneJobs = await this.jobRepository.find({ status: JobStatus.DONE });

    response.totalInprogressJobs = await this.jobRepository.count({ status: JobStatus.INPROGRESS });
    response.totalVerifiedCompanies = await this.companyRepository.count({ isVerified: true });
    response.totalFreelances = await this.userRepository.count({ role: Role.FREELANCE });
    response.totalDoneJobs = doneJobs.length;
    response.totalCompanies = await this.companyRepository.count();
    response.totalJobs = await this.jobRepository.count();

    response.totalWorkingFreelances = await this.jobEmployeeRepositoty.count({
      jobEmployeeStatus: JobEmployeeStatus.WORKING,
    });

    const salaries = doneJobs.map((job) => job.salary);

    response.totalSalaryPaid = salaries.reduce((prev, curr) => prev + curr);
    response.highestJobSalary = Math.max(...salaries);

    const entityManager = getManager();
    const _jobsInArea: any[] = await entityManager.query(
      'SELECT COUNT(jobs.id) as job_count, area_id, areas.name as area_name, countries.id as country_id, countries.name as country_name FROM "jobs" INNER JOIN "areas" ON "jobs".area_id="areas".id INNER JOIN "countries" ON "areas".country_id="countries".id GROUP BY area_id, area_name, country_name, countries.id ORDER BY job_count DESC LIMIT 4',
    );

    response.jobsInArea = [];

    for (let index = 0; index < _jobsInArea.length; index++) {
      response.jobsInArea.push({
        totalJobs: Number(_jobsInArea[index]['job_count']),
        areaId: _jobsInArea[index]['area_id'],
        areaName: _jobsInArea[index]['area_name'],
        countryId: _jobsInArea[index]['country_id'],
        countryName: _jobsInArea[index]['country_name'],
      });
    }

    response.opportunityJob = await this.jobRepository.count({
      where: {
        status: Not(In([JobStatus.DONE, JobStatus.CANCEL])),
      },
    });

    return response;
  }
}
