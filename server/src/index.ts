import express from 'express'
import { MikroORM, RequestContext } from '@mikro-orm/core'
import { EntityManager, PostgreSqlDriver } from '@mikro-orm/postgresql'
import http from 'http'
import cors from 'cors'
import mikroOrmConfig from './mikro-orm.config'

var { ruruHTML } = require("ruru/server")

export const DI = {} as {
    server: http.Server;
    orm: MikroORM<PostgreSqlDriver>,
    em: EntityManager<PostgreSqlDriver>
};

var { createHandler } = require("graphql-http/lib/use/express")
var { buildSchema } = require("graphql")

var schema = buildSchema(`
    type Query {
      hello: String
    }
  `)

var root = {
    hello() {
        return "Hello world!"
    },
}

var app = express()


export const init = (async () => {
    DI.orm = await MikroORM.init<PostgreSqlDriver>(mikroOrmConfig);
    DI.em = DI.orm.em

    app.use(cors({
        origin: ["http://localhost:5173"],
        credentials: true,
        optionsSuccessStatus: 200
    }))

    app.use(express.json());
    app.use((_req, _res, next) => RequestContext.create(DI.em, next));

    app.all(
        "/graphql",
        createHandler({
            schema: schema,
            rootValue: root,
        })
    )

    app.get("/", (_req, res) => {
        res.type("html")
        res.end(ruruHTML({ endpoint: "/graphql" }))
    })

    DI.server = app.listen(4000, "localhost", () => {
        console.log(`listening on 4000`)
    });
})();
