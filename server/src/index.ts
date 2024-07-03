import express from 'express'

import { MikroORM, RequestContext } from '@mikro-orm/core'
import { EntityManager, EntityRepository, PostgreSqlDriver } from '@mikro-orm/postgresql'

import http from 'http'
import cors from 'cors'

import mikroOrmConfig from './mikro-orm.config'

import { Transaction } from './entities/Transaction'
import { Category } from './entities/Category'
import { Map } from './entities/Map'

import { TransactionController } from './controllers/transactions.controller'
import { CategoryController } from './controllers/categories.controller'
import { MappingController } from './controllers/mapping.controller'

export const DI = {} as {
    server: http.Server;
    orm: MikroORM<PostgreSqlDriver>,
    em: EntityManager<PostgreSqlDriver>

    transactionsRepository: EntityRepository<Transaction>,
    categoriesRepository: EntityRepository<Category>,
    mapRepository: EntityRepository<Map>
};

var app = express()

export const init = (async () => {
    DI.orm = await MikroORM.init<PostgreSqlDriver>(mikroOrmConfig);
    DI.em = DI.orm.em

    DI.transactionsRepository = DI.orm.em.getRepository(Transaction)
    DI.categoriesRepository = DI.orm.em.getRepository(Category)
    DI.mapRepository = DI.orm.em.getRepository(Map)

    app.use(cors({
        origin: ["http://localhost:5173"],
        credentials: true,
        optionsSuccessStatus: 200
    }))

    app.use(express.json());
    app.use((_req, _res, next) => RequestContext.create(DI.orm.em, next));

    app.use('/transactions', TransactionController)
    app.use('/categories', CategoryController)
    app.use('/mapping', MappingController)

    app.get('/', (_req, res) => res.json({ message: 'Financer BE API - author: Jad Samadi' }));

    DI.server = app.listen(4000, "localhost", () => {
        console.log(`listening on http://localhost:4000`)
    });
})();
