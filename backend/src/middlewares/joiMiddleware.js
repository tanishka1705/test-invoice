import { UpdateValidator, projectValidator } from "../utils/joiValidator";
import catchAsync from '../utils/catchAsync'
import AppError from "../utils/appError";

const validateCompanyReqBody = catchAsync(async (req, res, next) => {
    if (Object.keys(req.body).length !== 0) {
        const schema = UpdateValidator
        const { error } = schema.validate(req.body)

        if (error) {
            const msg = error.details.map(err => err.message).join(', ')
            next(new AppError(msg, 400))
        }
        next()
    }
    else next(new AppError(`Please provide data to update!`, 400))
})

export const validateProjectReqBody = catchAsync(async (req, res, next) => {
    if (Object.keys(req.body).length !== 0) {
        const schema = projectValidator
        const { error } = schema.validate(req.body)

        console.log(error);

        if (error) {
            const msg = error.details.map(err => err.message).join(', ')
            next(new AppError(msg, 400))
        }
        next()
    }
    else next(new AppError(`Please provide data to update!`, 400))
})

export default validateCompanyReqBody