import { MigrationInterface, QueryRunner } from 'typeorm';

import { CompanyInformationEntity } from '@Entities/company-information.entity';
import { CompanyEntity } from '@Entities/company.entity';

import rawInformationOfCompanies from './data/raw_information_of_companies.json';

export class AddInformationOfCompanies1637072431806 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const companyInformationRepository = queryRunner.connection.getRepository(CompanyInformationEntity);
    const companyRepository = queryRunner.connection.getRepository(CompanyEntity);

    const _companies = await companyRepository.find();

    for (let index = 0; index < _companies.length; index++) {
      const _company = _companies[index];
      const rawInformationOfCompany = rawInformationOfCompanies[index];

      const _companyInformation = new CompanyInformationEntity();
      _companyInformation.company = _company;
      _companyInformation.companyId = _company.id;
      _companyInformation.addresses = rawInformationOfCompany.addresses;
      _companyInformation.phoneNumber = rawInformationOfCompany.phoneNumber;
      _companyInformation.paxNumber = rawInformationOfCompany.paxNumber;
      _companyInformation.socialNetworks = rawInformationOfCompany.socialNetworks;
      _companyInformation.description = rawInformationOfCompany.description;
      _companyInformation.numberOfEmployees = rawInformationOfCompany.numberOfEmployees;
      _companyInformation.dateOfEstablishment = rawInformationOfCompany.dateOfEstablishment;

      await companyInformationRepository.save(_companyInformation);

      _company.information = _companyInformation;
      await companyRepository.save(_company);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const companyRepository = queryRunner.connection.getRepository(CompanyEntity);
    await companyRepository.clear();
  }
}
