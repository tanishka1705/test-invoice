import { Router } from 'express'
const invoiceRouter = Router()

import userAuth from '../middlewares/authMiddleware'
import { createInvoice, deleteInvoice, getAllInvoice, getInvoiceById, updateInvoice } from '../controllers/invoice-controllers'

invoiceRouter.post('/', userAuth, createInvoice)
invoiceRouter.get('/', userAuth, getAllInvoice)
invoiceRouter.get('/:id', userAuth, getInvoiceById)
invoiceRouter.patch('/:id', userAuth, updateInvoice)
invoiceRouter.delete('/:id', userAuth, deleteInvoice)

export default invoiceRouter                                    