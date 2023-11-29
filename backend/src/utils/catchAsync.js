import AppError from "./appError"

const catchAsync = fn => {
    return (req, res, next) => fn(req, res, next).catch(err => {
        console.log(err);
        if (err.name === 'CastError') return next(new AppError(`Invalid ${err.kind}! Please provide valid Id`, 400))
        else if (err.name === 'ValidationError') return next(new AppError(`${err._message}, All fields are required!`, 400))
        else if (err.name === 'MongoServerError') {
            // const message = err.message.split(" {")[1].split('}')[0]
            // return next(new AppError(`Duplicate Key Found: ${message}`, 400))
            return next(new AppError(`Duplicate Key Found: ${err.message}`, 400))
        }
        else return next(new AppError(err.message, 400))
    })
}

export default catchAsync