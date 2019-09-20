import getUserId from "../utils/getUserId"
import request from "graphql-request"
const User = {
    /* posts(parent, args, {db, prisma}, info) {
        return db.posts.filter((currentPost) => currentPost.author === parent.id)
    },
    comments(parent, args, {db, prisma}, info) {
        return db.comments.filter((currentComment) => currentComment.author === parent.id)
    } */
    email(parent, args, {request, prisma}, info) {
        //Check if the parent(User) is authenticated and if the userId of parent matches with auth Id, if it matches it's fine else don't
        const userId = getUserId(request, false)
        //Dependent on selection set, if no id in selection set then issue
        if(userId && parent.id === userId)
            return parent.email
        else
            return null
    }
}

export default User