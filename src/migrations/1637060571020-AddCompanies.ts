import {MigrationInterface, QueryRunner} from "typeorm";

import { BusinessFieldEntity } from '@Entities/business-field.entity';
import { CompanyEntity } from '@Entities/company.entity';
import { CountryEntity } from '@Entities/country.entity';

import rawCompanies from './data/raw_companies.json';

export class AddCompanies1637060571020 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      const businessFieldRepository = await queryRunner.connection.getRepository(BusinessFieldEntity);
      const countryRepository = await queryRunner.connection.getRepository(CountryEntity);
      const companyRepository = await queryRunner.connection.getRepository(CompanyEntity);

      const countries = await countryRepository.find();
      const businessFields = await businessFieldRepository.find();

      await companyRepository.save(
        rawCompanies.map(rawCompany => {
          const _company = new CompanyEntity();
          _company.isVerified = rawCompany.isVerified;
          _company.email = rawCompany.email;
          _company.stars = rawCompany.stars;
          _company.name = rawCompany.name;
          _company.logo = rawCompany.logo;
          _company.country = countries[Math.floor(Math.random() * countries.length)];
          _company.businessFields = businessFields.sort(() => .5 - Math.random()).slice(0, 2);
          return _company;
        })
      );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
