import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { LoggerMiddleware } from '@Middlewares/logger.middleware'

// import { AuthModule } from './modules/auth/auth.module';

import configuration from './config/configuration';



@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration]
    }),
    TypeOrmModule.forRoot(),
    // AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
