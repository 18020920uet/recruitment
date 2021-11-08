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

import { AccountModule } from '@Modules/account/account.module';
import { AuthenticationModule } from '@Modules/authentication/authentication.module';
import { UserModule } from '@Modules/user/user.module';

@Module({
  imports: [
    MulterModule.register({
      dest: 'public',
    }),
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV}`,
      load: [configuration],
      isGlobal: true,
    }),
    AutomapperModule.forRoot({
      options: [
        {
          name: 'classMapper',
          pluginInitializer: classes,
        },
      ],
      singular: true,
    }),
    TypeOrmModule.forRootAsync(typeOrmConfigAsync),
    AccountModule,
    AuthenticationModule,
    UserModule,
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
