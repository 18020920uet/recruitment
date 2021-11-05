import { CurriculumVitaeExperienceType } from '@Shared/enums/curriculum-vitae-experience-type';

export class CurriculumVitaeExperience {
  id: number;
  index: number;
  companyEmail: string;
  companyName: string;
  startDate: Date;
  endDate: Date;
  role: string;
  description: string;
  type: CurriculumVitaeExperienceType;
}
