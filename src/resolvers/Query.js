import getUserId from '../utils/getUserId'

const Query = {
    users(parent, args, {prisma}, info) {
        //info contains the request detail. The query projection/selection set can be found out from here directly
        //2nd arg - nothing, string, object. Default is nothing which causes to select only all scalar fields
        const opArgs = {
            first: args.first,
            skip: args.skip,
            after: args.after,
            orderBy: args.orderBy
        }
        if(args.query) {
            opArgs.where = {
                OR: [{
                    name_contains: args.query
                }/* , {
                    email_contains: args.query
                } */]
            }
        }
        return prisma.query.users(opArgs, info)
    },
    myPosts(parent, args, { prisma, request }, info) {
        const userId = getUserId(request)
        const opArgs = {            
            first: args.first,
            skip: args.skip,
            after: args.after,
            orderBy: args.orderBy,
            where: {
                author: {
                    id: userId
                }
            }
        }

        if (args.query) {
            opArgs.where.OR = [{
                title_contains: args.query
            }, {
                body_contains: args.query
            }]
        }

        return prisma.query.posts(opArgs, info)
    },
    posts(parent, args, {prisma}, info) {
        const opArgs = {            
            first: args.first,
            skip: args.skip,
            after: args.after,
            orderBy: args.orderBy,
            where: {
                published: true
            }
        }

        if (args.query) {
            opArgs.where.OR = [{
                    title_contains: args.query
                }, {
                    body_contains: args.query
                }]
        }
        console.log(opArgs)
        return prisma.query.posts(opArgs, info)
    },
    comments(parent, args, {prisma}, info) {
        const opArgs = {            
            ...args
        }
        return prisma.query.comments(opArgs, info)
    },
    me(parent, args, { prisma, request }, info) {
        const userId = getUserId(request)
        
        return prisma.query.user({
            where: {
                id: userId
            }
        })
    },
    async post(parent, args, { prisma, request }, info) {
        const userId = getUserId(request, false)
        /**
         * This returns a post if there is a post with the id belonging to the current user
         * irrespective of it being published or not, or else if the post doesn't belong to the 
         * current user then return only if it is already published
         */
        const posts = await prisma.query.posts({
            where: {
                id: args.id,
                OR: [{
                    published: true
                }, {
                    author: {
                        id: userId
                    }
                }]
            }
        }, info)

        if (posts.length === 0) {
            throw new Error('Post not found')
        }

        return posts[0]
    }
}

export default Query