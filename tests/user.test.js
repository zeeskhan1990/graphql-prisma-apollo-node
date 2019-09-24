import getFirstName from '../src/utils/user'
import 'cross-fetch/polyfill'
import ApolloBoost, {gql} from "apollo-boost"
import prisma from "../src/prisma"
import bcrypt from "bcryptjs"

//Same port as declared in globalSetup
const client = new ApolloBoost({
    uri:'http://localhost:4800'
})

beforeEach(async () => {
    await prisma.mutation.deleteManyPosts()
    await prisma.mutation.deleteManyUsers()
    const user = await prisma.mutation.createUser({
        data: {
            name: 'TestUser',
            email: 'test@testuser.com',
            password: bcrypt.hashSync('12345678')
        }
    })
    console.log("CREATED USER", JSON.stringify(user, undefined, 4))    
    await prisma.mutation.createPost({
        data: {
            title: 'My published post',
            body: '',
            published: true,
            author: {
                connect: {
                    id: user.id
                }
            }
        }
    })
    await prisma.mutation.createPost({
        data: {
            title: 'My NOT published post',
            body: '',
            published: false,
            author: {
                connect: {
                    id: user.id
                }
            }
        }
    })
})

test('should create a new user', async () => {
    const createUser = gql`
        mutation {
            createUser(data: {
                name: "Roo",
                email: "roo@roo.com",
                password: "12345678"
            }) {
                token
                user {
                    id
                }
            }
        }
    `

    const response = await client.mutate({
        mutation: createUser 
    })

    const exists = await prisma.exists.User({id: response.data.createUser.user.id})
    expect(exists).toBe(true)
})

test('Should return all users', async () => {
    const getUsers = gql`
        query {
            users {
                id
                name
                email
            }
        }
    `
    const response = await client.query({ query: getUsers })

    expect(response.data.users.length).toBe(1)
    expect(response.data.users[0].email).toBe(null)
    expect(response.data.users[0].name).toBe('TestUser')
})


test('should get first name', () => {
    const firstName = getFirstName('Zeeshan Khan')
    expect(firstName).toBe('Zeeshan')    
})