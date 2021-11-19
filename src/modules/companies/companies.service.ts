import { Injectable } from '@nestjs/common';
import { InjectMapper } from '@automapper/nestjs';
import type { Mapper } from '@automapper/types';
import { Like, Not, IsNull } from "typeorm";

import { CompanyRepository } from '@Repositories/company.repository';

import { CompanyEntity } from '@Entities/company.entity';

import { GetCompaniesFilterWithTheFirstCharacterInNameQuery } from './dtos/requests';
import { GetCompanyDetailResponse } from './dtos/responses';
import { Company } from '@Shared/responses/company';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectMapper() private readonly mapper: Mapper,
    private companyRepository: CompanyRepository,
  ) {}

  async getCompanies(
    getCompaniesFilterWithTheFirstCharacterInNameQuery: GetCompaniesFilterWithTheFirstCharacterInNameQuery
  ): Promise<Company[]> {
    const page = getCompaniesFilterWithTheFirstCharacterInNameQuery.page;
    const character = getCompaniesFilterWithTheFirstCharacterInNameQuery.character;

    const _companies = await this.companyRepository.find({
      where: character != undefined ?
        [ { name: Like(`${character.toLowerCase()}%`) }, { name: Like(`${character.toUpperCase()}%`) }]
         :
        { name : Not(IsNull()) },
      relations: [ 'country' ],
      skip: page > 0 ? page - 1 : 0 * (character != undefined ? 6 : 10),
      take: (character != undefined ? 6 : 10),
      order: { name: 'ASC' }
    });
    return _companies.map((_company) => this.mapper.map(_company, Company, CompanyEntity));
  }

  async getCompanyDetail(companyId: string): Promise<GetCompanyDetailResponse> {
    const _company = await this.companyRepository.findOne({
      where: { id: companyId },
      relations: [ 'country', 'information', 'businessFields' ],
    });
    return this.mapper.map(_company, GetCompanyDetailResponse, CompanyEntity);
  }
}
