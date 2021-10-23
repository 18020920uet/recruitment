"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = () => ({
    port: parseInt(process.env.PORT, 10) || 3000,
    bscryptSlatRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS),
    host: process.env.HOST,
    database: {
        type: 'mysql',
        host: process.env.DATABASE_HOST,
        port: process.env.DATABASE_PORT,
        name: process.env.DATABASE_NAME,
        username: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        entities: ['dist/**/*.entity{.ts,.js}'],
        migrations: ['src/migrations/**/*.ts'],
        subscribers: ['src/subscriber/**/*.ts'],
        cli: {
            entitiesDir: 'src/entities',
            migrationsDir: 'src/migrations',
            subscribersDir: 'src/subscribers',
        },
    },
    secret: {
        jwt: {
            accessSecert: process.env.JWT_ACCESS_SECERT,
            refreshSecert: process.env.JWT_REFRESH_SECERT,
        },
        activateSecert: process.env.ACTIVATE_SECERT,
        iv: process.env.IV_START,
    },
});
//# sourceMappingURL=configuration.js.map