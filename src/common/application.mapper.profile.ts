import { Injectable } from '@nestjs/common';
import { InjectMapper, AutomapperProfile } from '@automapper/nestjs';
import type { Mapper } from '@automapper/types';
import { mapFrom } from '@automapper/core';

import { CurriculumVitaeExperienceEntity } from '@Entities/curriculum-vitae-experience.entity';
import { CompanyInformationEntity } from '@Entities/company-information.entity';
import { CurriculumVitaeEntity } from '@Entities/curriculum-vitae.entity';
import { BusinessFieldEntity } from '@Entities/business-field.entity';
import { JobCandidateRelation } from '@Entities/job-candidate.relation';
import { JobEmployeeRelation } from '@Entities/job-employee.relation';
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
import { CandidateOfJob, EmployeeOfJob, JobDetail } from '@Modules/jobs/dtos/responses';
import { FreeLancer } from '@Modules/users/dtos/responses';

import { JobEmployeeStatus } from '@Shared/enums/job-employee-status';
import { JobApplyStatus } from '@Shared/enums/job-apply-status';

import { FileService } from '@Shared/services/file.service';

@Injectable()
export class ApplicationMapperProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper, private fileService: FileService) {
    super(mapper);
  }

  mapProfile() {
    return (mapper: Mapper) => {
      mapper
        .createMap(UserEntity, User)
        .forMember(
          (user: User) => user.avatar,
          mapFrom((_user: UserEntity) => this.fileService.getAvatar(_user)),
        )
        .forMember(
          (user: User) => user.company,
          mapFrom((_user: UserEntity) =>
            _user.role == 1 && _user.employeeOfCompany ? _user.employeeOfCompany.company : null,
          ),
        )
        .forMember(
          (user: User) => user.companyRole,
          mapFrom((_user: UserEntity) =>
            _user.role == 1 && _user.employeeOfCompany ? _user.employeeOfCompany.role : null,
          ),
        );
      mapper.createMap(CurriculumVitaeExperienceEntity, CurriculumVitaeExperience);
      mapper
        .createMap(CurriculumVitaeEntity, CurriculumVitae)
        .forMember(
          (curriculumVitae: CurriculumVitae) => curriculumVitae.email,
          mapFrom((_curriculumVitae: CurriculumVitaeEntity) => _curriculumVitae.user.email),
        )
        .forMember(
          (curriculumVitae: CurriculumVitae) => curriculumVitae.firstName,
          mapFrom((_curriculumVitae: CurriculumVitaeEntity) => _curriculumVitae.user.firstName),
        )
        .forMember(
          (curriculumVitae: CurriculumVitae) => curriculumVitae.lastName,
          mapFrom((_curriculumVitae: CurriculumVitaeEntity) => _curriculumVitae.user.lastName),
        )
        .forMember(
          (curriculumVitae: CurriculumVitae) => curriculumVitae.avatar,
          mapFrom((_curriculumVitae: CurriculumVitaeEntity) => this.fileService.getAvatar(_curriculumVitae.user)),
        )
        .forMember(
          (curriculumVitae: CurriculumVitae) => curriculumVitae.experiences,
          mapFrom((_curriculumVitae: CurriculumVitaeEntity) => _curriculumVitae.experiences),
        )
        .forMember(
          (curriculumVitae: CurriculumVitae) => curriculumVitae.certifications,
          mapFrom((_curriculumVitae: CurriculumVitaeEntity) => {
            return _curriculumVitae.certifications
              .split('|')
              .filter((certification) => certification)
              .map((certification) => this.fileService.getCertification(certification));
          }),
        )
        .forMember(
          (curriculumVitae: CurriculumVitae) => curriculumVitae.languages,
          mapFrom((_curriculumVitae) => _curriculumVitae.languages),
        )
        .forMember(
          (curriculumVitae: CurriculumVitae) => curriculumVitae.nationality,
          mapFrom((_curriculumVitae: CurriculumVitaeEntity) => _curriculumVitae.nationality),
        )
        .forMember(
          (curriculumVitae: CurriculumVitae) => curriculumVitae.hobbies,
          mapFrom((_curriculumVitae: CurriculumVitaeEntity) =>
            _curriculumVitae.hobbies.split('|').filter((hobby) => hobby),
          ),
        )
        .forMember(
          (curriculumVitae: CurriculumVitae) => curriculumVitae.dateOfBirth,
          mapFrom((_curriculumVitae: CurriculumVitaeEntity) => {
            const dateOfBirth = _curriculumVitae.dateOfBirth ? _curriculumVitae.dateOfBirth : new Date();
            return dateOfBirth.toLocaleDateString('en-Us');
          }),
        )
        .forMember(
          (curriculumVitae: CurriculumVitae) => curriculumVitae.skills,
          mapFrom((_curriculumVitae: CurriculumVitaeEntity) => {
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
        (company: Company) => company.logo,
        mapFrom((_company: CompanyEntity) => this.fileService.getLogo(_company)),
      );
      mapper.createMap(CountryEntity, CountryEntity);
      mapper.createMap(AreaEntity, AreaEntity);
      mapper
        .createMap(CompanyInformationEntity, CompanyInformation)
        .forMember(
          (information: CompanyInformation) => information.photos,
          mapFrom((_companyInformation: CompanyInformationEntity) =>
            _companyInformation.photos
              .split('|')
              .filter((photo) => photo)
              .map((photo) => this.fileService.getPhoto(photo)),
          ),
        )
        .forMember(
          (information: CompanyInformation) => information.addresses,
          mapFrom((_companyInformation: CompanyInformationEntity) =>
            _companyInformation.addresses.split('|').filter((address) => address),
          ),
        )
        .forMember(
          (information: CompanyInformation) => information.socialNetworks,
          mapFrom((_companyInformation: CompanyInformationEntity) => _companyInformation.socialNetworks),
        );
      mapper
        .createMap(CompanyEntity, GetCompanyDetailResponse)
        .forMember(
          (detail: GetCompanyDetailResponse) => detail.logo,
          mapFrom((_company: CompanyEntity) => this.fileService.getLogo(_company)),
        )
        .forMember(
          (detail: GetCompanyDetailResponse) => detail.businessFields,
          mapFrom((_company: CompanyEntity) =>
            _company.businessFields.map((_businessField) => ({ id: _businessField.id, name: _businessField.name })),
          ),
        );
      mapper.createMap(SkillEntity, Skill);
      mapper.createMap(JobEntity, Job);
      mapper
        .createMap(JobEntity, JobOfCompany)
        .forMember(
          (job: JobOfCompany) => job.totalEmployees,
          mapFrom(
            (_job: JobEntity) =>
              _job.employeeRelations.filter((eR) => eR.jobEmployeeStatus == JobEmployeeStatus.WORKING).length,
          ),
        )
        .forMember(
          (job: JobOfCompany) => job.totalCandidates,
          mapFrom(
            (_job: JobEntity) =>
              _job.candidateRelations.filter((cR) => cR.applyStatus == JobApplyStatus.WAITING).length,
          ),
        );
      mapper.createMap(JobEntity, JobDetail);
      mapper.createMap(BusinessFieldEntity, BusinessField);
      mapper
        .createMap(CurriculumVitaeEntity, FreeLancer)
        .forMember(
          (freelancer: FreeLancer) => freelancer.email,
          mapFrom((_curriculumVitae: CurriculumVitaeEntity) => _curriculumVitae.user.email),
        )
        .forMember(
          (freelancer: FreeLancer) => freelancer.firstName,
          mapFrom((_curriculumVitae: CurriculumVitaeEntity) => _curriculumVitae.user.firstName),
        )
        .forMember(
          (freelancer: FreeLancer) => freelancer.lastName,
          mapFrom((_curriculumVitae: CurriculumVitaeEntity) => _curriculumVitae.user.lastName),
        )
        .forMember(
          (freelancer: FreeLancer) => freelancer.id,
          mapFrom((_curriculumVitae: CurriculumVitaeEntity) => _curriculumVitae.user.id),
        )
        .forMember(
          (freelancer: FreeLancer) => freelancer.role,
          mapFrom((_curriculumVitae: CurriculumVitaeEntity) => _curriculumVitae.user.role),
        )
        .forMember(
          (freelancer: FreeLancer) => freelancer.avatar,
          mapFrom((_curriculumVitae: CurriculumVitaeEntity) => this.fileService.getAvatar(_curriculumVitae.user)),
        )
        .forMember(
          (freelancer: FreeLancer) => freelancer.skills,
          mapFrom((_curriculumVitae: CurriculumVitaeEntity) => {
            return _curriculumVitae.skillRelations.map((skillRelation) => ({
              id: skillRelation.skill.id,
              name: skillRelation.skill.name,
              experience: skillRelation.experience,
            }));
          }),
        );
      mapper.createMap(JobCandidateRelation, CandidateOfJob);
      mapper.createMap(JobEmployeeRelation, EmployeeOfJob)
      .forMember(
        (employeeOfJob: EmployeeOfJob) => employeeOfJob.employeeStatus,
        mapFrom((_jobEmployeeRelation: JobEmployeeRelation) => _jobEmployeeRelation.jobEmployeeStatus),
      )
      ;
    };
  }
}
