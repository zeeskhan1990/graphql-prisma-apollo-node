import getUserId from "../utils/getUserId"
import request from "graphql-request"
const User = {
    /* email(parent, args, {request, prisma}, info) {
        const userId = getUserId(request, false)
        if(userId && parent.id === userId)
            return parent.email
        else
            return null
    } */
    email: {
        fragment: 'fragment userId on User { id }',
        resolve: (parent, args, {request, prisma}, info) => {
            /* Check if the parent(User) is authenticated and if the userId of parent matches with auth Id,
            if it matches it's fine else don't */
            const userId = getUserId(request, false)

            /* Dependent on selection set, if no id in selection set then issue.
            That's why fragments, whatever you define in fragments prisma is gonna fetch it
            from the database even if it's not asked for in the selection set.
            We are only asking for id here and not email because this resolver only gonna run iff email
            is asked for already */

            if(userId && parent.id === userId)
                return parent.email
            else
                return null
        }
    },
    posts: {
        fragment: 'fragment userId on User { id }',
        resolve: (parent, args, {request, prisma}, info) => {
            /**
             * Return only published posts if not of current user
             */
            const userId = getUserId(request, false)
            const opArgs = {
                where: {
                    author: {
                        id: parent.id
                    }
                }
            }
            if(!(userId && parent.id === userId))
                opArgs.where.published = true
            return prisma.query.posts(opArgs)
        }
    }
}

export default User