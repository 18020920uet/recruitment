import { MigrationInterface, QueryRunner, Not } from 'typeorm';

import { BusinessFieldEntity } from '@Entities/business-field.entity';
import { CompanyEntity } from '@Entities/company.entity';
import { SkillEntity } from '@Entities/skill.entity';
import { AreaEntity } from '@Entities/area.entity';
import { JobEntity } from '@Entities/job.entity';

import { JobExperience } from '@Shared/enums/job-experience';
import { JobWorkMode } from '@Shared/enums/job-work-mode';
import { JobStatus } from '@Shared/enums/job-status';

import rawJobs from './data/raw_jobs.json';

export class AddJobs1637258873110 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const businessFieldRepository = await queryRunner.connection.getRepository(BusinessFieldEntity);
    const companyRepository = await queryRunner.connection.getRepository(CompanyEntity);
    const skillRepository = await queryRunner.connection.getRepository(SkillEntity);
    const areaRepository = await queryRunner.connection.getRepository(AreaEntity);
    const jobRepository = await queryRunner.connection.getRepository(JobEntity);

    const businessFields = await businessFieldRepository
      .createQueryBuilder('businessField')
      .where("businessField.name != 'Information Technology'")
      .getMany();

    const itBusinessField = await businessFieldRepository.findOne({ name: 'Information Technology' });

    const areas = await areaRepository.find({ countryId: 240 });
    const companies = await companyRepository.find();

    const skills = await skillRepository.find();

    let jobs: JobEntity[] = [];

    for (const rawJob of rawJobs) {
      const job = new JobEntity();
      job.title = rawJob.title;
      job.description = rawJob.description;
      job.minEmployees = rawJob.minEmployees;
      job.maxEmployees = rawJob.maxEmployees;
      job.experience = rawJob.experience as JobExperience;
      job.workMode = rawJob.workMode as JobWorkMode;
      job.status = rawJob.status as JobStatus;
      job.salary = rawJob.salary;
      job.createdAt = new Date(rawJob.createdAt);
      job.updatedAt = new Date(rawJob.updatedAt);
      job.startDate = rawJob.startDate;
      job.endDate = rawJob.endDate;

      job.area = areas[Math.floor(Math.random() * areas.length)];
      job.businessFields = [businessFields[Math.floor(Math.random() * businessFields.length)], itBusinessField];
      job.company = companies[Math.floor(Math.random() * companies.length)];
      job.skills = skills.sort(() => 0.5 - Math.random()).slice(0, 3);

      jobs.push(job);

      if (jobs.length == 100) {
        await jobRepository.save(jobs);
        jobs = [];
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.connection.getRepository(JobEntity).clear();
  }
}
