import { Injectable } from '@nestjs/common';
import { InjectMapper, AutomapperProfile } from '@automapper/nestjs';
import type { Mapper } from '@automapper/types';
import { mapFrom } from '@automapper/core';

import { CurriculumVitaeExperienceEntity } from '@Entities/curriculum-vitae-experience.entity';
import { CompanyInformationEntity } from '@Entities/company-information.entity';
import { BusinessFieldEntity } from '@Entities/business-field.entity';
import { CurriculumVitaeEntity } from '@Entities/curriculum-vitae.entity';
import { CountryEntity } from '@Entities/country.entity';
import { CompanyEntity } from '@Entities/company.entity';
import { ReviewEntity } from '@Entities/review.entity';
import { SkillEntity } from '@Entities/skill.entity';
import { UserEntity } from '@Entities/user.entity';
import { AreaEntity } from '@Entities/area.entity';
import { JobEntity } from '@Entities/job.entity';

import { CurriculumVitaeExperience } from '@Shared/responses/curriculum-vitae-experience';
import { CurriculumVitae } from '@Shared/responses/curriculum-vitae';
import { BusinessField } from '@Shared/responses/business-field';
import { ReviewByUser } from '@Shared/responses/review-by-user';
import { Company } from '@Shared/responses/company';
import { Review } from '@Shared/responses/review';
import { Skill } from '@Shared/responses/skill';
import { User } from '@Shared/responses/user';
import { Job } from '@Shared/responses/job';

import { CompanyInformation, GetCompanyDetailResponse, JobOfCompany } from '@Modules/companies/dtos/responses';
import { FreeLancer } from '@Modules/users/dtos/responses';
import { CandidateOfJob, EmployeeOfJob, JobDetail } from '@Modules/jobs/dtos/responses';

import { FileService } from '@Shared/services/file.service';
import { JobCandidateRelation } from '@Entities/job-candidate.relation';
import { JobEmployeeRelation } from '@Entities/job-employee.relation';
import { JobEmployeeStatus } from '@Shared/enums/job-employee-status';
import { JobApplyStatus } from '@Shared/enums/job-apply-status';

@Injectable()
export class ApplicationMapperProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper, private fileService: FileService) {
    super(mapper);
  }

  mapProfile() {
    return (mapper) => {
      mapper.createMap(UserEntity, User).forMember(
        (user) => user.avatar,
        mapFrom((_user) => this.fileService.getAvatar(_user)),
      );
      mapper.createMap(CurriculumVitaeExperienceEntity, CurriculumVitaeExperience);
      mapper
        .createMap(CurriculumVitaeEntity, CurriculumVitae)
        .forMember(
          (curriculumVitae) => curriculumVitae.email,
          mapFrom((_curriculumVitae) => _curriculumVitae.user.email),
        )
        .forMember(
          (curriculumVitae) => curriculumVitae.firstName,
          mapFrom((_curriculumVitae) => _curriculumVitae.user.firstName),
        )
        .forMember(
          (curriculumVitae) => curriculumVitae.lastName,
          mapFrom((_curriculumVitae) => _curriculumVitae.user.lastName),
        )
        .forMember(
          (curriculumVitae) => curriculumVitae.avatar,
          mapFrom((_curriculumVitae) => this.fileService.getAvatar(_curriculumVitae.user)),
        )
        .forMember(
          (curriculumVitae) => curriculumVitae.experiences,
          mapFrom((_curriculumVitae) => _curriculumVitae.experiences),
        )
        .forMember(
          (curriculumVitae) => curriculumVitae.certifications,
          mapFrom((_curriculumVitae) => {
            return _curriculumVitae.certifications
              .split('|')
              .filter((certification) => certification)
              .map((certification) => this.fileService.getCertification(certification));
          }),
        )
        .forMember(
          (curriculumVitae) => curriculumVitae.languages,
          mapFrom((_curriculumVitae) => _curriculumVitae.languages),
        )
        .forMember(
          (curriculumVitae) => curriculumVitae.nationality,
          mapFrom((_curriculumVitae) => _curriculumVitae.nationality),
        )
        .forMember(
          (curriculumVitae) => curriculumVitae.hobbies,
          mapFrom((_curriculumVitae) => _curriculumVitae.hobbies.split('|').filter((hobby) => hobby)),
        )
        .forMember(
          (curriculumVitae) => curriculumVitae.dateOfBirth,
          mapFrom((_curriculumVitae) => {
            const dateOfBirth = _curriculumVitae.dateOfBirth ? _curriculumVitae.dateOfBirth : new Date();
            return dateOfBirth.toLocaleDateString('en-Us');
          }),
        )
        .forMember(
          (curriculumVitae) => curriculumVitae.skills,
          mapFrom((_curriculumVitae) => {
            return _curriculumVitae.skillRelations.map((skillRelation) => ({
              id: skillRelation.skill.id,
              name: skillRelation.skill.name,
              experience: skillRelation.experience,
            }));
          }),
        );
      mapper.createMap(ReviewEntity, Review);
      mapper.createMap(ReviewEntity, ReviewByUser);
      mapper.createMap(CompanyEntity, Company).forMember(
        (company) => company.logo,
        mapFrom((_company) => this.fileService.getLogo(_company)),
      );
      mapper.createMap(CountryEntity, CountryEntity);
      mapper.createMap(AreaEntity, AreaEntity);
      mapper
        .createMap(CompanyInformationEntity, CompanyInformation)
        .forMember(
          (information) => information.photos,
          mapFrom((_companyInformation) =>
            _companyInformation.photos
              .split('|')
              .filter((photo) => photo)
              .map((photo) => this.fileService.getPhoto(photo)),
          ),
        )
        .forMember(
          (information) => information.addresses,
          mapFrom((_companyInformation) => _companyInformation.addresses.split('|').filter((address) => address)),
        )
        .forMember(
          (information) => information.socialNetworks,
          mapFrom((_companyInformation) => _companyInformation.socialNetworks),
        );
      mapper
        .createMap(CompanyEntity, GetCompanyDetailResponse)
        .forMember(
          (detail) => detail.logo,
          mapFrom((_company) => this.fileService.getLogo(_company)),
        )
        .forMember(
          (detail) => detail.businessFields,
          mapFrom((_company) =>
            _company.businessFields.map((_businessField) => ({ id: _businessField.id, name: _businessField.name })),
          ),
        );
      mapper.createMap(SkillEntity, Skill);
      mapper.createMap(JobEntity, Job);
      mapper.createMap(JobEntity, JobOfCompany)
        .forMember(
          (job: JobOfCompany) => job.totalEmployees,
          mapFrom((_job: JobEntity) =>
            _job.employeeRelations.filter((eR) => eR.jobEmployeeStatus == JobEmployeeStatus.WORKING).length
          )
        )
        .forMember(
          (job: JobOfCompany) => job.totalCandidates,
          mapFrom((_job: JobEntity) =>
            _job.candidateRelations.filter((cR) => cR.applyStatus == JobApplyStatus.WAITING).length
          )
        )
      mapper.createMap(JobEntity, JobDetail);
      mapper.createMap(BusinessFieldEntity, BusinessField);
      mapper
        .createMap(CurriculumVitaeEntity, FreeLancer)
        .forMember(
          (freelancer) => freelancer.email,
          mapFrom((_curriculumVitae) => _curriculumVitae.user.email),
        )
        .forMember(
          (freelancer) => freelancer.firstName,
          mapFrom((_curriculumVitae) => _curriculumVitae.user.firstName),
        )
        .forMember(
          (freelancer) => freelancer.lastName,
          mapFrom((_curriculumVitae) => _curriculumVitae.user.lastName),
        )
        .forMember(
          (freelancer) => freelancer.id,
          mapFrom((_curriculumVitae) => _curriculumVitae.user.id),
        )
        .forMember(
          (freelancer) => freelancer.role,
          mapFrom((_curriculumVitae) => _curriculumVitae.user.role),
        )
        .forMember(
          (freelancer) => freelancer.avatar,
          mapFrom((_curriculumVitae) => this.fileService.getAvatar(_curriculumVitae.user)),
        )
        .forMember(
          (freelancer) => freelancer.skills,
          mapFrom((_curriculumVitae) => {
            return _curriculumVitae.skillRelations.map((skillRelation) => ({
              id: skillRelation.skill.id,
              name: skillRelation.skill.name,
              experience: skillRelation.experience,
            }));
          }),
        );
      mapper.createMap(JobCandidateRelation, CandidateOfJob, { useUndefined: false });
      mapper.createMap(JobEmployeeRelation, EmployeeOfJob, { useUndefined: false });
    };
  }
}
