import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { ResourcesController } from './resources.controller';
import { ResourcesService } from './resources.service';

import { NationalityEntity } from '@Entities/nationality.entity';
import { LanguageEntity } from '@Entities/language.entity';
import { CountryEntity } from '@Entities/country.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LanguageEntity, NationalityEntity, CountryEntity])],
  providers: [ResourcesService],
  controllers: [ResourcesController],
})
export class ResourcesModule {}
