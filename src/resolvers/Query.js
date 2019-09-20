const Query = {
    users(parent, args, ctx, info) {
        //info contains the request detail. The query projection/selection set can be found out from here directly
        //2nd arg - nothing, string, object. Default is nothing which causes to select only all scalar fields
        const opArgs = {}
        if(args.query) {
            opArgs.where = {
                OR: [{
                    name_contains: args.query
                }, {
                    email_contains: args.query
                }]
            }
        }
        return ctx.prisma.query.users(opArgs, info)
    },
    posts(parent, args, {prisma}, info) {
        const opArgs = {}

        if (args.query) {
            opArgs.where = {
                OR: [{
                    title_contains: args.query
                }, {
                    body_contains: args.query
                }]
            }
        }
        return prisma.query.posts(opArgs, info)
    },
    comments(parent, args, {prisma}, info) {
        return prisma.query.comments(null, info)
    },
    me() {
        return {
            id: '999',
            name: "prius",
            email:"prius@prius.com" 
        }
    },
    post() {
        return {
            id: '100',
            title: 'Hello Post',
            body: "Body of hello post",
            published: true
        }
    }
}

export default Query