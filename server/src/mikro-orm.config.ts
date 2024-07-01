import { LoadStrategy } from "@mikro-orm/core";
import { Migrator } from "@mikro-orm/migrations";
import { PostgreSqlDriver } from '@mikro-orm/postgresql'

export default {
    extensions: [Migrator],
    entities: ['./dist/entities'],
    entitiesTs: ['./src/entities'],
    dbName: "financer",
    user: "postgres",
    password: "postgres",
    driver: PostgreSqlDriver,
    debug: false,
    migrations: {
        path: "./src/migrations"
    },
    loadStrategy: LoadStrategy.JOINED
}