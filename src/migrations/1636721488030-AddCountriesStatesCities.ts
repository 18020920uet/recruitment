import {MigrationInterface, QueryRunner} from "typeorm";

import { CountryEntity } from '@Entities/country.entity';
import { StateEntity } from '@Entities/state.entity';
import { CityEntity } from '@Entities/city.entity';

import rawCountries from './data/raw_countries_states_cities.json';

export class AddCountriesStatesCities1636721488030 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      const countryRepository = queryRunner.connection.getRepository(CountryEntity);
      const stateRepository = queryRunner.connection.getRepository(StateEntity);
      const cityRepository = queryRunner.connection.getRepository(CityEntity);

      const oldCountries = await countryRepository.find();
      await countryRepository.remove(oldCountries);
      const oldStates = await stateRepository.find();
      await stateRepository.remove(oldStates);
      const oldCities = await cityRepository.find();
      await cityRepository.remove(oldCities);

      for (const rawCountry of rawCountries) {
        const _country = new CountryEntity();
        _country.id = rawCountry.id;
        _country.name = rawCountry.name;
        _country.totalCities = 0;
        _country.totalStates = 0;
        const states: StateEntity[] = [];
        let cities: CityEntity[] = [];
        for (const rawState of rawCountry.states) {
          const _state = new StateEntity();
          _state.id = rawState.id;
          _state.name = rawState.name;
          _state.countryId = _country.id;
          _state.totalCities = 0;
          for (const rawCity of rawState.cities) {
            const _city = new CityEntity();
            _city.id = rawCity.id;
            _city.countryId = _country.id;
            _city.stateId = _state.id;
            _city.name = rawCity.name;
            cities.push(_city);
            if (cities.length > 5000) {
              await cityRepository.insert(cities);
              cities = [];
            }
            _state.totalCities++;
            _country.totalCities++;
          }
          states.push(_state);
          _country.totalStates++;
        }
        await cityRepository.insert(cities);
        await stateRepository.insert(states);
        await countryRepository.insert(_country);
      }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      const countryRepository = queryRunner.connection.getRepository(CountryEntity);
      const stateRepository = queryRunner.connection.getRepository(StateEntity);
      const cityRepository = queryRunner.connection.getRepository(CityEntity);

      const oldCountries = await countryRepository.find();
      await countryRepository.remove(oldCountries);
      const oldStates = await stateRepository.find();
      await stateRepository.remove(oldStates);
      const oldCities = await cityRepository.find();
      await cityRepository.remove(oldCities);
    }

}
