
import Router from 'express-promise-router'
import { DI } from '../index'
import { Category } from '../entities/Category'
import { Map } from '../entities/Map'
import { Transaction, UserEnum } from '../entities/Transaction'

const router = Router()

router.get('/', async (_req, res) => {
    const data = await DI.mapRepository.findAll({ populate: ["DBCategory"] })
    return res.send(data)
})

router.post('/', async (req, res) => {

    const body = req.body

    const DBCategory = await DI.em.fork().findOne(Category, { id: body.DBCategory })
    if (DBCategory === null) {
        return res.status(500).json({ message: "Category does not exist" });
    }

    const mapExists = await DI.em.fork().findOne(Map, { originalCategory: body.originalCategory, DBCategory })
    if (mapExists !== null) {
        return res.status(500).json({ message: "Map already exists" });
    }
    let map = new Map()
    map.originalCategory = body.originalCategory
    map.DBCategory = DBCategory

    await DI.em.persistAndFlush(map)
    return res.send({ id: map.id })
})

router.put('/:id', async (req, res) => {

    const id = Number(req.params.id)
    const body = req.body

    const DBMap = await DI.em.fork().findOne(Map, { id: id })
    if (DBMap === null) {
        return res.status(500).json({ message: "Map does not exist" });
    }

    const DBCategory = await DI.em.fork().findOne(Category, { id: body.DBCategory })
    if (DBCategory === null) {
        return res.status(500).json({ message: "Category does not exist" });
    }

    const mapExists = await DI.em.fork().findOne(Map, { originalCategory: body.originalCategory, DBCategory })
    if (mapExists !== null) {
        return res.status(500).json({ message: "Map already exists" });
    }

    DBMap.originalCategory = body.originalCategory
    DBMap.DBCategory = DBCategory

    await DI.em.persistAndFlush(DBMap)
    return res.send({ id: DBMap.id })
})

router.delete('/:id', async (req, res) => {
    const id = Number(req.params.id)
    const map = await DI.mapRepository.findOne({ id: id })
    if (map === null) {
        return res.status(500).json({ message: "Transaction does not exist" });
    }
    const transactions = await DI.transactionsRepository.find({ category: map.DBCategory })
    if (transactions && transactions.length > 0) {
        return res.status(500).json({ message: "Categorie contains transactions" });
    }
    await DI.em.nativeDelete(Map, map)
    return res.send(true)
})

router.post('/mapEntries', async (req, res) => {

    const body = req.body

    //@ts-ignore
    Promise.all(body.map((async (e: any) => {
        const category = await DI.categoriesRepository.findOne({ id: e.category })
        if (category === null) {
            return res.status(500).json({ message: "Category does not exist" });
        }
        let transaction = new Transaction()
        transaction.title = e.title
        transaction.user = body.user as UserEnum
        transaction.category = category
        transaction.value = e.value
        transaction.transactionDate = e.transactionDate
        await DI.em.persistAndFlush(transaction)
    })))
    return res.send(true)

})

export const MappingController = router