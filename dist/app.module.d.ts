import { MiddlewareConsumer, NestModule } from '@nestjs/common';
import type { Mapper } from '@automapper/types';
export declare class AppModule implements NestModule {
    private readonly mapper;
    constructor(mapper: Mapper);
    configure(consumer: MiddlewareConsumer): void;
}
