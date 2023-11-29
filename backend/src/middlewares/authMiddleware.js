import jwt from "jsonwebtoken";
import AppError from "../utils/appError";
import catchAsync from "../utils/catchAsync";

const userAuth = catchAsync(async (req, res, next) => {
  const token = req.headers.authorization;
  if (token) {
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
      if (err) {
        next(new AppError(`JWT expires`, 401));
      } else {
        // console.log(decoded);
        req.user = decoded;
        next();
      }
    });
  } else next(new AppError(`token not provided!`, 401));
});

export default userAuth;
