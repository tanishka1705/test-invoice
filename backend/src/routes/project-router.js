import { Router } from 'express'
const projectRouter = Router()

import userAuth from '../middlewares/authMiddleware'
import { createProject, deleteProjectById, getAllProjectsBelongsTo, getAllProjectsOfUser, getProjectById, updateProjectById, } from '../controllers/project-controller'
import { validateProjectReqBody } from '../middlewares/joiMiddleware'

projectRouter.post('/', userAuth, createProject)
projectRouter.get('/', userAuth, getAllProjectsOfUser)
// projectRouter.get('/cmp_projects/:id', userAuth, getAllProjectsBelongsTo)
projectRouter.get('/:cId/:pId', userAuth, getProjectById)
projectRouter.patch('/:cId/:pId', userAuth, validateProjectReqBody, updateProjectById)
projectRouter.delete('/:cId/:pId', userAuth, deleteProjectById)

export default projectRouter