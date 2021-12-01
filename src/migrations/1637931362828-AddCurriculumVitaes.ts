import { MigrationInterface, QueryRunner } from 'typeorm';

import { CurriculumVitaeExperienceEntity } from '@Entities/curriculum-vitae-experience.entity';
import { CurriculumVitaeSkillRelation } from '@Entities/curriculum-vitae-skill.relation';
import { CurriculumVitaeEntity } from '@Entities/curriculum-vitae.entity';
import { LanguageEntity } from '@Entities/language.entity';
import { CountryEntity } from '@Entities/country.entity';
import { SkillEntity } from '@Entities/skill.entity';
import { AreaEntity } from '@Entities/area.entity';
import { UserEntity } from '@Entities/user.entity';

import { CurriculumVitaeExperienceType } from '@Shared/enums/curriculum-vitae-experience-type';
import { JobExperience } from '@Shared/enums/job-experience';

import rawUsers from './data/raw_users.json';

export class AddCurriculumVitaes1637931362828 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const curriculumViateRepository = queryRunner.connection.getRepository(CurriculumVitaeEntity);
    const languageRespository = queryRunner.connection.getRepository(LanguageEntity);
    const countryRepository = queryRunner.connection.getRepository(CountryEntity);
    const skillRepository = queryRunner.connection.getRepository(SkillEntity);
    const areaRepository = queryRunner.connection.getRepository(AreaEntity);
    const userRepository = queryRunner.connection.getRepository(UserEntity);

    const languages = await languageRespository.find();
    const countries = await countryRepository.find();
    const skills = await skillRepository.find();
    const areas = await areaRepository.find();
    const users = await userRepository.find();

    // Save CV
    let cvs: CurriculumVitaeEntity[] = [];

    for (let _i = 0; _i < 1000; _i++) {
      const user = users[_i];
      const rawUser = rawUsers[_i];

      const _cv = new CurriculumVitaeEntity();
      _cv.briefIntroduce = rawUser['briefIntroduce'];
      _cv.phoneNumber = rawUser['phoneNumber'];
      _cv.introduce = rawUser['introduce'];
      _cv.address = rawUser['address'];
      _cv.hobbies = rawUser['hobbies'];
      _cv.rate = rawUser['rate'];

      _cv.country = countries[Math.floor(Math.random() * countries.length)];

      const _areas = areas.filter((area) => area.countryId == _cv.country.id);

      if (areas.length != 0) {
        _cv.area = _areas[Math.floor(Math.random() * _areas.length)];
      } else {
        _cv.area = areas[Math.floor(Math.random() * areas.length)];
      }

      const _cvSkillRelations: CurriculumVitaeSkillRelation[] = [];
      const _skills = skills.sort(() => Math.random() - 0.5).slice(10, 13);

      const jobExperiences = Object.values(JobExperience);

      for (const _skill of _skills) {
        const _cvSkillRelation = new CurriculumVitaeSkillRelation();
        _cvSkillRelation.skill = _skill;
        _cvSkillRelation.cv = _cv;
        _cvSkillRelation.experience = jobExperiences[Math.floor(Math.random() * jobExperiences.length)];
        _cvSkillRelations.push(_cvSkillRelation);
      }

      _cv.skillRelations = _cvSkillRelations;

      const experiences: CurriculumVitaeExperienceEntity[] = [];

      for (let index = 0; index < 3; index++) {
        const experience = new CurriculumVitaeExperienceEntity();
        experience.index = index;
        experience.companyName = `Example company ${index}`;
        experience.companyEmail = `example${index}@company`;
        experience.startDate = new Date(`11/01/2020`);
        experience.endDate = new Date('11/15/2020');
        experience.role = `Employee ${index}`;
        experience.description = `A short short short description about this job of ${experience.companyName}`;
        experience.type = CurriculumVitaeExperienceType.WORK;
        experiences.push(experience);
      }

      _cv.experiences = experiences;
      _cv.languages = languages.sort(() => Math.random() - 0.5).slice(0, 3);

      _cv.user = user;

      cvs.push(_cv);
      if (cvs.length == 100) {
        await curriculumViateRepository.save(cvs);
        cvs = [];
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const userRepository = queryRunner.connection.getRepository(UserEntity);
    await userRepository.delete({ password: '' });
  }
}
