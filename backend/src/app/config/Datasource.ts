import {   DataSource } from 'typeorm'
import { CONFIG } from '.'
 
export const AppDataSource = new DataSource({
    type: "sqlite",
    database: "bootup.db",
    synchronize:true,
    logging: false,
    entities: ["build/factory/entities/**/*.entity{.ts,.js}"],
    subscribers: [],
    migrationsRun: CONFIG.APP.APP_ENV === "DEV" ? true : false,
    migrations: ["build/factory/migrations/**/*{.ts,.js}"],
    migrationsTableName: "migration_table",

    extra: {
        ssl: {
            rejectUnauthorized: false
        }
    }
})
