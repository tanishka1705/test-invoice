import catchAsync from "../utils/catchAsync";
import bcrypt from 'bcrypt'

const hashPassword = catchAsync(async (password) => {
    return await bcrypt.hash(password, 10)
})

const comparePassword = catchAsync(async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword)
})

export default hashPassword
export { comparePassword }