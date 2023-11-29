import { Router } from 'express'
import { Login, Register, getAllUsers, getUserById, deleteUserById, forgetPasswordHandler, resetPassword, checkUserAuth } from '../controllers/user-controller'
import userAuth from '../middlewares/authMiddleware'
const userRouter = Router()

userRouter.post('/login', Login)
userRouter.post('/register', Register)
userRouter.get('/', getAllUsers)
userRouter.post('/forget/password', forgetPasswordHandler)
userRouter.patch('/reset/password/:token', resetPassword)
userRouter.get('/:id', getUserById)
userRouter.delete('/:id', deleteUserById)
userRouter.get('/auth', userAuth, checkUserAuth)

export default userRouter