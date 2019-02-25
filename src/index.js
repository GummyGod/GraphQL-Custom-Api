import { GraphQLServer } from 'graphql-yoga';

// Scalar GQL Types => String,  Bool, Int, Float, ID

// Type definitions(schema)
const typeDefs = `
    type Query {
        me: User!
    }

    type User {
         id: ID!
         name: String!
         email: String!
         age: Int
    }
`

// Resolvers for the API
const resolvers = {
    Query: {
        me() {
            return {
                id: '123098',
                name: 'Christian',
                email: 'Christian@gmail.com',
                age:20
            }
        }
    }
}

const server = new GraphQLServer({
    typeDefs,
    resolvers
});

server.start(() => {
    console.log('Server is up and running...')
})