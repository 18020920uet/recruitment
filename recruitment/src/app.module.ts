import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { AutomapperModule, InjectMapper } from '@automapper/nestjs';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import type { Mapper } from '@automapper/types';
import { classes } from '@automapper/classes';

import { typeOrmConfigAsync } from './common/config/typeorm.configuration';
import configuration from './common/config/configuration';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { LoggerMiddleware } from '@Middlewares/logger.middleware'

import { AccountModule } from './modules/account/account.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `${process.env.NODE_ENV}.env`,
      load: [configuration],
      isGlobal: true
    }),
    AutomapperModule.forRoot({
      options: [{ name: 'classMapper', pluginInitializer: classes }],
      singular: true
    }),
    TypeOrmModule.forRootAsync(typeOrmConfigAsync),
    AccountModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  constructor(@InjectMapper() private readonly mapper: Mapper) {}

  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
