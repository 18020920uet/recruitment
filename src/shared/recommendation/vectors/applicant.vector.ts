import { CurriculumVitaeEntity } from '@Entities/curriculum-vitae.entity';
import { JobEmployeeRelation } from '@Entities/job-employee.relation';
import { UserEntity } from '@Entities/user.entity';

export class ApplicantVector {
  public vector: number[];
  constructor(
    _user: UserEntity,
    _cv: CurriculumVitaeEntity,
    _jobEmployeeRelations: JobEmployeeRelation[],
    _skillIds: number[],
    _jobSalary: number,
  ) {
    let salary = 0;
    const areaId = _cv.areaId;
    const rate = _user.totalReviews != 0 ? _user.reviewPoint / _user.totalReviews : 0;
    const doneAJob = _jobEmployeeRelations.length != 0 ? 1 : 0;

    const skillIds = [];
    const levels = [];

    const experiences = [
      'Internship',
      'Entry level',
      'Intermidate',
      'Asssociate',
      'Mid-Senior level',
      'Senior',
      'Executive',
      'Director',
    ];

    if (_jobEmployeeRelations.length != 0) {
      for (const _jobEmployeeRelation of _jobEmployeeRelations) {
        const _job = _jobEmployeeRelation.job;
        const levelIndex = experiences.findIndex((experience) => experience == _job.experience);
        for (let index = 0; index < _job.skills.length; index++) {
          const skillIndex = skillIds.findIndex((skillId) => skillId == _job.skills[index].id);
          if (skillIndex == -1) {
            skillIds.push(_job.skills[index].id);
            levels.push(levelIndex);
          } else {
            if (levelIndex > levels[skillIndex]) {
              levels[skillIndex] = levelIndex;
            }
          }
        }
        salary += _jobEmployeeRelation.salary;
      }
    }

    if (_jobEmployeeRelations.length != 0) {
      salary = salary / _jobEmployeeRelations.length;
    } else {
      salary = _jobSalary;
    }

    for (const skillRelation of _cv.skillRelations) {
      const levelIndex = experiences.findIndex((experience) => experience == skillRelation.experience);
      const skillIndex = skillIds.findIndex((skillId) => skillId == skillRelation.skill.id);
      if (skillIndex == -1) {
        skillIds.push(skillRelation.skill.id);
        levels.push(levelIndex);
      } else {
        if (levelIndex > levels[skillIndex]) {
          levels[skillIndex] = levelIndex;
        }
      }
    }

    const levelSkills = [];

    for (const _skillId of _skillIds) {
      const skillIndex = skillIds.findIndex((skillId) => skillId == _skillId);
      if (skillIndex == -1) {
        levelSkills.push(0);
      } else {
        levelSkills.push(levels[skillIndex]);
      }
    }

    // Vector [salary, rate, doneAJob, areaId, levelSkill1, levelSkill2, ...]
    this.vector = [salary, rate, doneAJob, areaId];
    this.vector.push(...levelSkills);
  }
}
