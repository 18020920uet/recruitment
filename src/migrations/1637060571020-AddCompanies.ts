import { MigrationInterface, QueryRunner } from 'typeorm';

import { BusinessFieldEntity } from '@Entities/business-field.entity';
import { CompanyEntity } from '@Entities/company.entity';
import { CountryEntity } from '@Entities/country.entity';
import { AreaEntity } from '@Entities/area.entity';

import rawCompanies from './data/raw_companies.json';

export class AddCompanies1637060571020 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const businessFieldRepository = queryRunner.connection.getRepository(BusinessFieldEntity);
    const countryRepository = queryRunner.connection.getRepository(CountryEntity);
    const companyRepository = queryRunner.connection.getRepository(CompanyEntity);
    const areaRepository = queryRunner.connection.getRepository(AreaEntity);

    const businessFields = await businessFieldRepository.find();
    const countries = await countryRepository.find();
    const areas = await areaRepository.find();

    await companyRepository.save(
      rawCompanies.map((rawCompany) => {
        const _company = new CompanyEntity();
        _company.isVerified = rawCompany.isVerified;
        _company.email = rawCompany.email;
        _company.stars = rawCompany.stars;
        _company.name = rawCompany.name;
        _company.logo = rawCompany.logo;
        _company.country = countries[Math.floor(Math.random() * countries.length)];

        const _areas = areas.filter((area) => area.countryId == _company.country.id);

        if (_areas.length != 0) {
          _company.area = _areas[Math.floor(Math.random() * _areas.length)];
        } else {
          _company.area = null;
        }

        _company.businessFields = businessFields.sort(() => 0.5 - Math.random()).slice(0, 2);
        return _company;
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const companyRepository = queryRunner.connection.getRepository(CompanyEntity);
    await companyRepository.clear();
  }
}
