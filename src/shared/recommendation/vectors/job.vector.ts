import { JobEntity } from '@Entities/job.entity';

export class JobVector {
  public vector: number[];
  public skillIds: number[];

  constructor(_job: JobEntity) {
    const areaId = _job.areaId;
    const salary = _job.salary;
    const rate =
      _job.company.totalReviews != 0 ? _job.company.reviewPoint / _job.company.totalReviews : _job.company.stars;
    const doneAJob = 1;
    const skillIds = _job.skills.map((skill) => skill.id);
    const levelSkills = [];

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
    const levelIndex = experiences.findIndex((experience) => experience == _job.experience);

    this.skillIds = skillIds;

    for (let index = 0; index < skillIds.length; index++) {
      levelSkills.push(levelIndex);
    }

    // Vector [salary, rate, doneAJob, areaId, levelSkill1, levelSkill2, ...]
    this.vector = [salary, rate, doneAJob];
    this.vector.push(...levelSkills);
  }
}
