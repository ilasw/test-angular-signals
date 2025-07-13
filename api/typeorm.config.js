"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const path_1 = require("path");
exports.default = new typeorm_1.DataSource({
    type: 'postgres',
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT || '5432', 10),
    username: process.env.DATABASE_USER || 'postgres',
    password: process.env.DATABASE_PASSWORD || 'postgres',
    database: process.env.DATABASE_NAME || 'week_project',
    entities: [(0, path_1.join)(__dirname, 'src', '**', '*.entity.{ts,js}')],
    migrations: [(0, path_1.join)(__dirname, 'src/migrations/*.{ts,js}')],
    migrationsTableName: 'migrations',
});
//# sourceMappingURL=typeorm.config.js.map