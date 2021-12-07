import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { AutomapperModule, InjectMapper } from '@automapper/nestjs';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import type { Mapper } from '@automapper/types';
import { ConfigModule } from '@nestjs/config';
import { classes } from '@automapper/classes';

import { typeOrmConfigAsync } from './common/config/typeorm.configuration';
import configuration from './common/config/configuration';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { LoggerMiddleware } from '@Middlewares/logger.middleware';

import { AuthenticationModule } from '@Modules/authentication/authentication.module';
import { ResourcesModule } from './modules/resources/resources.module';
import { CompaniesModule } from './modules/companies/companies.module';
import { AccountModule } from '@Modules/account/account.module';
import { UsersModule } from './modules/users/users.module';
import { JobsModule } from './modules/jobs/jobs.module';
import { UserModule } from '@Modules/user/user.module';
import { AdminModule } from './modules/admin/admin.module';
import { ReviewsModule } from './modules/reviews/reviews.module';

@Module({
  imports: [
    MulterModule.register({ dest: 'public' }),
    ConfigModule.forRoot({
      envFilePath: process.env.NODE_ENV == 'development' ? `.env.${process.env.NODE_ENV}` : '.env',
      load: [configuration],
      isGlobal: true,
    }),
    AutomapperModule.forRoot({ options: [{ name: 'classMapper', pluginInitializer: classes }], singular: true }),
    TypeOrmModule.forRootAsync(typeOrmConfigAsync),
    AccountModule,
    AuthenticationModule,
    UserModule,
    ResourcesModule,
    UsersModule,
    CompaniesModule,
    JobsModule,
    AdminModule,
    ReviewsModule,
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
