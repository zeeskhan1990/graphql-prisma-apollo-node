import jwt from "jsonwebtoken"

const generateToken = (userId) => {
    return jwt.sign({userId: userId}, 'mysecret', {expiresIn: '2 days'})
}

export default generateToken