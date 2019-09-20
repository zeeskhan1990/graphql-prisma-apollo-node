import jwt from "jsonwebtoken"

const getUserId = (request) => {
    const authorizationHeader = request.request.headers.authorization
    console.log(authorizationHeader)
    if(!authorizationHeader)
        throw new Error("Authentication is required")
    const token = authorizationHeader.replace('Bearer ','')
    console.log(token)
    const decodedUser = jwt.verify(token, 'mysecret')
    console.log(decodedUser)
    return decodedUser.userId
}

export default getUserId