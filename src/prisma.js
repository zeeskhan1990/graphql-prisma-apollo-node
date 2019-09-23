import {Prisma} from "prisma-binding"
import {fragmentReplacements} from './resolvers/index'
//env-cmd used in the dev script in package.json points to the path to the dev env file which contains the value of PRISMA_ENDPOINT

const prisma = new Prisma({
    typeDefs:'src/generated/prisma.graphql',
    endpoint:process.env.PRISMA_ENDPOINT,
    secret:process.env.PRISMA_SECRET,
    fragmentReplacements
})

export default prisma