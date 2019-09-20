import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import getUserId from '../utils/getUserId'

/**
 * JWT token would have three parts. header.payload.signature
 * The "header" & "payload" is just simple base-64 encoded json objects with the below mentioned props.
 * header contains algo and type"jwt", payload actual data, signature is created by hashing the header & payload together with
 * the secret. SO if someone tries to create a jwt from header & payload, his created signature won't match becaused it's
 * hashed with a secret different to that used by the server.
 * Both in the 'sign' and 'verify' method the hashing is used to create signature. In the sign method, the hash is created and appended 
 * at the end to create the JWT token. In the verify method, the header & payload is again hashed with the secret and then
 * the created signature is matched with the signature in the input JWT token
 */

//1st arg - payload, set whatever info you need in the token. 2nd arg - secret to verify the integrity of the token
//such that no one gets the token and then tries to change the id. The secret is only going to live in the node js (application) server
const token = jwt.sign({id: 46}, 'mysecret')
console.log(token)

//{ id: 46, iat: 1568967724 } [iat = issuedAt:timestamp]
const decoded = jwt.decode(token)
console.log(decoded)

//verify that the token is actually created by this server
const redecoded = jwt.verify(token, 'mysecret')
console.log(redecoded)

/**
 * During login, first the hashedpassword against the email is fetched, then the input password
 * & the hashedpassword is compared for a match. It is to be noted that the hashed one is not 
 * decoded back but rather the input one is encoded again.
 */
const testHashing = async () => {
    const email = "mew@mew.com"
    const password = "12345678"
    const hashedPwd = "$2a$10$wHHESBnulR1dVSFp9a/tuO1mvc2IIzT5ZDCIxBFK0tNAT1Jl9nIgq"
    const isMatch = await bcrypt.compare(password, hashedPwd)
    console.log(isMatch)
}
testHashing()

const Mutation = {
    /**
     * Here in info we would receive {user token}, so if we pass that directly to prisma it would throw error
     * because prisma's return type has no definition of "token". Setting nothing would cause prisma to return 
     * only scalar types
     */
    async createUser(parent, args, { prisma }, info) {
        if(args.data.password.length < 8) {
            throw new Error("min length password should be 8")
        }
        const password = await bcrypt.hash(args.data.password, 10)
        const user = await prisma.mutation.createUser({
            data: {
                ...args.data,
                password
            }
        }/* , info */)

        return {
            user,
            token: jwt.sign({userId: user.id}, 'mysecret')
        }
    },
    async login(parent, args, {prisma}, info) {
        const user = await prisma.query.user({
            where: {
                email:args.data.email
            }
        })
        if(!user)
            throw new Error("No user")
        const isMatch = await bcrypt.compare(args.data.password, user.password)
        if(isMatch)
            return {user, token:jwt.sign({userId: user.id}, 'mysecret')}
        else
            throw new Error("Wrong password")
    },
    deleteUser(parent, args, { request, prisma }, info) {
        const userId = getUserId(request)
        return prisma.mutation.deleteUser({
            where: {
                id: userId
            }
        }, info)
    },
    updateUser(parent, args, { request, prisma }, info) {
        const userId = getUserId(request)
        return prisma.mutation.updateUser({
            where: {
                id: userId
            },
            data: args.data
        }, info)
    },
    createPost(parent, args, { request, prisma }, info) {
        const userId = getUserId(request)
        return prisma.mutation.createPost({
            data: {
                title: args.data.title,
                body: args.data.body,
                published: args.data.published,
                author: {
                    connect: {
                        id: userId
                    }
                }
            }
        }, info)
    },
    async deletePost(parent, args, { request, prisma }, info) {
        const userId = getUserId(request)
        //This is a check to find if the post is by the authenticated user or not, there's no option in prisma delete post schema
        //to provide a where condition with the author of the post
        const postExists = await prisma.exists.Post({
            id: args.id,
            author: {
                id: userId
            }
        })
        if(!postExists)
            throw new Error("No post found for the current user")
        return prisma.mutation.deletePost({
            where: {
                id: args.id
            }
        }, info)
    },
    async updatePost(parent, args, { request, prisma }, info) {
        const userId = getUserId(request)
        const postExists = await prisma.exists.Post({
            id: args.id,
            author: {
                id: userId
            }
        })

        if (!postExists) {
            throw new Error('Unable to update post')
        }
        return prisma.mutation.updatePost({
            where: {
                id: args.id
            },
            data: args.data
        }, info)
    },
    createComment(parent, args, { request, prisma }, info) {
        const userId = getUserId(request)

        return prisma.mutation.createComment({
            data: {
                text: args.data.text,
                author: {
                    connect: {
                        id: userId
                    }
                },
                post: {
                    connect: {
                        id: args.data.post
                    }
                }
            }
        }, info)
    },
    async deleteComment(parent, args, { request, prisma }, info) {
        const userId = getUserId(request)
        const commentExists = await prisma.exists.Comment({
            id: args.id,
            author: {
                id: userId
            }
        })

        if (!commentExists) {
            throw new Error('Unable to delete comment')
        }
        return prisma.mutation.deleteComment({
            where: {
                id: args.id
            }
        }, info)
    },
    async updateComment(parent, args, { request, prisma }, info) {
        const userId = getUserId(request)
        const commentExists = await prisma.exists.Comment({
            id: args.id,
            author: {
                id: userId
            }
        })

        if (!commentExists) {
            throw new Error('Unable to update comment')
        }
        return prisma.mutation.updateComment({
            where: {
                id: args.id
            },
            data: args.data
        }, info)
    }
}

export default Mutation