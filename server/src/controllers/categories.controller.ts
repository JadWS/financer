import Router from 'express-promise-router'
import { DI } from '../index'
import { Category, TransactionTypeEnum } from '../entities/Category'

const router = Router()

router.get('/', async (_req, res) => {
    const data = await DI.categoriesRepository.findAll({})
    return res.send(data)
})

router.post('/', async (req, res) => {

    const body = req.body

    const categoryExists = await DI.em.fork().findOne(Category, { category: body.category, type: body.type as TransactionTypeEnum })
    if (categoryExists !== null) {
        return res.status(500).json({ message: "Category already exists" });
    }
    let category = new Category()
    category.category = body.category
    category.type = body.type

    await DI.em.persistAndFlush(category)
    return res.send({ id: category.id })
})

router.put('/:id', async (req, res) => {
    const id = Number(req.params.id)
    const body = req.body
    const categoryExists = await DI.em.fork().findOne(Category, { id: id })
    if (categoryExists === null) {
        return res.status(500).json({ message: "Category does not exist" });
    }
    categoryExists.category = body.category
    categoryExists.type = body.type

    await DI.em.persistAndFlush(categoryExists)
    return res.send(true)
})

router.delete('/:id', async (req, res) => {
    const id = Number(req.params.id)
    const category = await DI.categoriesRepository.findOne({ id: id })
    if (category === null) {
        return res.status(500).json({ message: "Transaction does not exist" });
    }
    const transactions = await DI.transactionsRepository.find({ category: category })
    if (transactions && transactions.length > 0) {
        return res.status(500).json({ message: "Categorie contains transactions" });
    }
    await DI.em.nativeDelete(Category, category)
    return res.send(true)
})

router.get('/:id', async (req, res) => {
    const id = Number(req.params.id)
    const data = await DI.categoriesRepository.findOne({ id: id })
    return res.send(data)
})

export const CategoryController = router