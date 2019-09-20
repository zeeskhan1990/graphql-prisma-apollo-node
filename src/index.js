import {GraphQLServer, PubSub} from "graphql-yoga"

import db from "./db"

import Query from "./resolvers/Query"
import Mutation from "./resolvers/Mutation"
import User from "./resolvers/User"
import Post from "./resolvers/Post"
import Comment from "./resolvers/Comment"
import Subscription from "./resolvers/Subscription"

import prisma from "./prisma"

const pubsub = new PubSub()

/**
 * What is being done here, is that an added abstraction is being provided by this graphql yoga server
 * The prisma server(service) is running at a defined port and is accessible directly through http at the same time
 * The prisma service auto generates a pleothera of type definitions from it's prisma.graphql, the resolvers to which are
 * auto defined and does the heavy lifting, this service can be called from the outside directly. Prisma connected to 
 * the postgres uses the prisma.graphql to define type and database access. This yoga server on the other hand
 * has it's own type definition in schema.graphql, and is also accessible from the outside,
 * but what we can do in addition here is that we can actually write up the resolvers for it's typedef
 * and through those resolvers we can apply pre and post conditions before using the prisma serivces through
 * it's node bindings to work with the same database. In this way to the client only a custom set of actions is exposed
 */
const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers: {
        Query,
        Mutation,
        Subscription,
        User,
        Post,
        Comment
    },
    context: (request) => {
        return {
            db,
            pubsub,
            prisma,
            request
        }
    }
})

server.start({port:4500}, () => {
    console.log('The server is running')
})