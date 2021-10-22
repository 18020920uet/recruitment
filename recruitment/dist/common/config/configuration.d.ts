declare const _default: () => {
    port: number;
    bscryptSlatRounds: number;
    host: string;
    database: {
        type: string;
        host: string;
        port: string;
        name: string;
        username: string;
        password: string;
        entities: string[];
        migrations: string[];
        subscribers: string[];
        cli: {
            entitiesDir: string;
            migrationsDir: string;
            subscribersDir: string;
        };
    };
    secret: {
        jwt: {
            accessSecert: string;
            refreshSecert: string;
        };
        activateSecert: string;
        iv: string;
    };
};
export default _default;
