const Subscription = {
    /* count: {
        subscribe(parent, args, {pubsub}, info) {
            ctx.pubsub.publish('trigger-channel', {
                count:189
            })
            
            ctx.pubsub.publish('trigger-channel-two', {
                count:255
            })
            return pubsub.asyncIterator(['trigger-channel', 'trigger-channel-two'])
        }
    }, */
    comment: {
        subscribe(parent, {postId}, {prisma}, info) {
            //This is to just check for existence before subscribing
            /* const post = db.posts.find((post) => post.id === postId && post.published)
            if(!post)
                throw new Error("No post")
            
            return pubsub.asyncIterator(`comment-channel-${postId}`) */
            return prisma.subscription.comment({
                where: {
                    node: {
                        post: {
                            id: postId
                        }
                    }
                }
            }, info)
        }
    },
    post: {
        subscribe(parent, args, {prisma}, info) {            
            return prisma.subscription.post({
                where: {
                    node: {
                        published: true
                    }
                }
            }, info)
        }
    }
}

export default Subscription