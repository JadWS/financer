import express from 'express'
import { MikroORM, RequestContext } from '@mikro-orm/core'
import { EntityManager, PostgreSqlDriver } from '@mikro-orm/postgresql'
import http from 'http'
import cors from 'cors'
import mikroOrmConfig from './mikro-orm.config'

export const DI = {} as {
    server: http.Server;
    orm: MikroORM<PostgreSqlDriver>,
    em: EntityManager<PostgreSqlDriver>
};

var app = express()

export const init = (async () => {
    DI.orm = await MikroORM.init<PostgreSqlDriver>(mikroOrmConfig);
    DI.em = DI.orm.em

    app.use(cors({
        origin: ["https://lbspotlight.org", "https://www.lbspotlight.org", "http://localhost:5173"],
        credentials: true,
        optionsSuccessStatus: 200
    }))

    app.use(express.json());
    app.use((_req, _res, next) => RequestContext.create(DI.orm.em, next));

    app.get('/', (_req, res) => res.json({ message: 'Financer BE API - author: Jad Samadi' }));

    DI.server = app.listen(4000, "localhost", () => {
        console.log(`listening on http://localhost:4000`)
    });
})();
