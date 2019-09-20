import jwt from "jsonwebtoken"

const getUserId = (request, requireAuth = true) => {
    const authorizationHeader = request.request.headers.authorization
    console.log(authorizationHeader)
    if(authorizationHeader) {
        const token = authorizationHeader.replace('Bearer ', '')
        console.log(token)
        const decoded = jwt.verify(token, 'mysecret')
        console.log(decoded)
        return decoded.userId
    }
    if (requireAuth) {
        throw new Error('Authentication is required')
    }
    return null
}

export default getUserId