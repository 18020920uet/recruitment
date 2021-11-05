import { Gender } from '@Shared/enums/gender';

export class CurriculumVitae {
  id: number;
  email: string;
  gender: Gender;
  dateOfBirth: Date;
  phoneNumber: string;
  nationality: number;
  address: string;
  summary: string;
  skills: string;
  educations: string;
  certifications: string;
  languages: string;
  hobbies: string;
  introduce: string;
  experiences: CurriculumVitaeExperienceEntity[]
  minimalHourlyRate: number;
}
