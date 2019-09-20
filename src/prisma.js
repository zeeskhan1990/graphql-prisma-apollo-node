import {Prisma} from "prisma-binding"

const prisma = new Prisma({
    typeDefs:'src/generated/prisma.graphql',
    endpoint:'http://192.168.99.100:4466',
    secret:'zeeshankhan'
})

export default prisma

/* const hello = async () => {
    const myData = await prisma.query.users(null, '{id name posts {id title}}')
    console.log(JSON.stringify(myData, undefined, 4))
}

hello()

prisma.exists.Comment({
    id:"ck0qkzvu1003k0885lx08igl7"
}).then((ifExist) => {
    console.log(ifExist)
}) */