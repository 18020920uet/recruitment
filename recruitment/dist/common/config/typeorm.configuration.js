"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeOrmConfigAsync = void 0;
const config_1 = require("@nestjs/config");
const fs = require("fs");
class TypeOrmConfig {
    static getOrmConfig(configService) {
        const config = {
            type: 'mysql',
            host: configService.get('database.host'),
            port: configService.get('database.port'),
            database: configService.get('database.name'),
            username: configService.get('database.username'),
            password: configService.get('database.password'),
            migrationsTableName: 'migrations',
            entities: ['dist/**/*.entity{.ts,.js}'],
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
            console.log('He');
        }
        return config;
    }
}
exports.default = TypeOrmConfig;
exports.typeOrmConfigAsync = {
    imports: [config_1.ConfigModule],
    useFactory: async (configService) => TypeOrmConfig.getOrmConfig(configService),
    inject: [config_1.ConfigService],
};
//# sourceMappingURL=typeorm.configuration.js.map