import { Router } from 'express'
const companyRouter = Router()
import validateCompanyReqBody from '../middlewares/joiMiddleware'

import userAuth from '../middlewares/authMiddleware'
import { createCompany, deleteCompanyById, getAllListedCompanies, getCompanyByID, getProjectsOfCompany, updateCompanyById } from '../controllers/company-controllers'

companyRouter.post('/', userAuth, createCompany)
companyRouter.get('/', userAuth, getAllListedCompanies)
companyRouter.get('/:id', userAuth, getCompanyByID)
companyRouter.get('/project/:id', userAuth, getProjectsOfCompany)
companyRouter.patch('/:id', userAuth, validateCompanyReqBody,updateCompanyById)
companyRouter.delete('/:id', userAuth, deleteCompanyById)

export default companyRouter