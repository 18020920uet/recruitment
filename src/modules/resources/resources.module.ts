import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ResourcesService } from './resources.service';
import { ResourcesController } from './resources.controller';

import { LanguageEntity } from '@Entities/language.entity';
import { NationalityEntity } from '@Entities/nationality.entity';
import { CountryEntity } from '@Entities/country.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([
      LanguageEntity,
      NationalityEntity,
      CountryEntity
    ])
  ],
  providers: [ResourcesService],
  controllers: [ResourcesController]
})
export class ResourcesModule {}
