import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModuleAsyncOptions, TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as fs from 'fs';

export default class TypeOrmConfig {
  static getOrmConfig(configService: ConfigService): TypeOrmModuleOptions {
    const config: TypeOrmModuleOptions = {
      type: 'postgres', // Sử dụng postgresql
      host: configService.get('database.host'),
      port: configService.get<number>('database.port'),
      database: configService.get('database.name'),
      username: configService.get('database.username'),
      password: configService.get('database.password'),
      migrationsTableName: 'migrations',
      entities: ['dist/**/*{.entity,.relation}{.ts,.js}'],
      migrations: ['dist/migrations/*.js'],
      subscribers: ['dist/subscribers/*.js'],
      cli: {
        entitiesDir: 'src/entities',
        migrationsDir: 'src/migrations',
        subscribersDir: 'src/subscribers',
      },
      synchronize: true,
    };

    if (!fs.existsSync('ormconfig.json')) {
      fs.writeFile('ormconfig.json', JSON.stringify(config), 'utf8', function (err) {
        if (err) {
          console.log('An error occured while writing ormconfig.json');
          return console.log(err);
        }
      });
    }
    return config;
  }
}

export const typeOrmConfigAsync: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService): Promise<TypeOrmModuleOptions> =>
    TypeOrmConfig.getOrmConfig(configService),
  inject: [ConfigService],
};
