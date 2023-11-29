import jwt from "jsonwebtoken";

const generateToken = (user, expiresIn) => {
    return jwt.sign({ _id: user._id, name: user.name, email: user.email }, process.env.SECRET_KEY, {
        expiresIn
    })
}

export default generateToken