import Router from 'express-promise-router'
import { DI } from '../index'
import { Transaction, UserEnum } from '../entities/Transaction'

const router = Router()

router.get('/', async (_req, res) => {
    const data = await DI.transactionsRepository.findAll({
        populate: ["category"]
    })
    return res.send(data)
})

router.post('/', async (req, res) => {
    const body = req.body

    const categoryExists = await DI.categoriesRepository.findOne({ id: body.category })
    if (categoryExists === null) {
        return res.status(500).json({ message: "Category does not exist" });
    }
    let transaction = new Transaction()
    transaction.title = body.title
    transaction.user = body.user as UserEnum
    transaction.category = categoryExists
    transaction.value = body.value
    transaction.transactionDate = body.transactionDate

    await DI.em.persistAndFlush(transaction)
    return res.send({ id: transaction.id })
})

router.put('/:id', async (req, res) => {
    const id = Number(req.params.id)
    const body = req.body
    const categoryExists = await DI.categoriesRepository.findOne({ id: body.category })
    if (categoryExists === null) {
        return res.status(500).json({ message: "Category does not exist" });
    }
    let transaction = await DI.em.fork().findOne(Transaction, { id: id })
    if (transaction === null) {
        return res.status(500).json({ message: "Transaction does not exist" });
    }
    transaction.title = body.title
    transaction.user = body.user
    transaction.category = categoryExists
    transaction.value = body.value
    transaction.transactionDate = body.transactionDate

    await DI.em.persistAndFlush(transaction)
    return res.send(true)
})

router.delete('/:id', async (req, res) => {
    const id = Number(req.params.id)
    const transaction = await DI.transactionsRepository.findOne({ id: id })
    if (transaction === null) {
        return res.status(500).json({ message: "Transaction does not exist" });
    }
    await DI.em.nativeDelete(Transaction, transaction)
    return res.send(true)
})

router.get('/:id', async (req, res) => {
    const id = Number(req.params.id)
    const data = await DI.transactionsRepository.findOne({ id: id }, {
        populate: ["category"]
    })
    return res.send(data)
})

export const TransactionController = router