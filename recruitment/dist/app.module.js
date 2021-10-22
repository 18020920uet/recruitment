"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const nestjs_1 = require("@automapper/nestjs");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const classes_1 = require("@automapper/classes");
const typeorm_configuration_1 = require("./common/config/typeorm.configuration");
const configuration_1 = require("./common/config/configuration");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const logger_middleware_1 = require("./common/middlewares/logger.middleware");
const account_module_1 = require("./modules/account/account.module");
let AppModule = class AppModule {
    constructor(mapper) {
        this.mapper = mapper;
    }
    configure(consumer) {
        consumer.apply(logger_middleware_1.LoggerMiddleware).forRoutes('*');
    }
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                envFilePath: `${process.env.NODE_ENV}.env`,
                load: [configuration_1.default],
                isGlobal: true,
            }),
            nestjs_1.AutomapperModule.forRoot({
                options: [{ name: 'classMapper', pluginInitializer: classes_1.classes }],
                singular: true,
            }),
            typeorm_1.TypeOrmModule.forRootAsync(typeorm_configuration_1.typeOrmConfigAsync),
            account_module_1.AccountModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    }),
    __param(0, (0, nestjs_1.InjectMapper)()),
    __metadata("design:paramtypes", [Object])
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map