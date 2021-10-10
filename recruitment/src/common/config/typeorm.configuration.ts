import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModuleAsyncOptions, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { LoggerOptions } from 'typeorm';

export default class TypeOrmConfig {
  static getOrmConfig(configService: ConfigService): TypeOrmModuleOptions {
    return {
      type: 'postgres', // Sử dụng postgresql
      host: configService.get('database.host'),
      port: configService.get<number>('database.port'),
      database: configService.get('database.name'),
      username: configService.get('database.username'),
      password: configService.get('database.password'),
      entities: [
         "dist/**/*.entity{.ts,.js}",
      ],
      migrations: [
         "src/migrations/**/*.ts"
      ],
      subscribers: [
         "src/subscriber/**/*.ts"
      ],
      cli: {
         "entitiesDir": "src/entities",
         "migrationsDir": "src/migrations",
         "subscribersDir": "src/subscribers"
      },
      synchronize: true
    };
  }
}

export const typeOrmConfigAsync: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService): Promise<TypeOrmModuleOptions> => TypeOrmConfig.getOrmConfig(configService),
  inject: [ConfigService]
};
