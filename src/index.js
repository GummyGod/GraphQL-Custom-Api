import { GraphQLServer } from 'graphql-yoga';

// Scalar GQL Types => String,  Bool, Int, Float, ID

// Demo user data 
const users = [
    {
    id: '1',
    name: 'Christian',
    email: 'chris@gmail.com',
    age:20
    },
    {
        id: '2',
        name: 'Mitchell',
        email: 'Mitchell@gmail.com',
        age:25
    },
    {
        id: '3',
        name: 'Max',
        email: 'Max@gmail.com',
        age:24
    }
];

// Demo posts
const posts = [
    {
        id: '1',
        title: 'Whatever1',
        body: 'Lorem ipsum dolor sit amet',
        published: true,
        author: '1'
    },
    {
        id: '2',
        title: 'Wassup',
        body: 'Lorem i am hungry lmao',
        published: true,
        author: '2'
    },
    {
        id: '3',
        title: 'Pancakes',
        body: 'I really want some pancakes to be honest',
        published:false,
        author: '3'
    }
]

// Type definitions(schema)
const typeDefs = `
    type Query {
        users(query: String): [User!]!
        posts(query: String): [Post!]!
        me: User!
        post: Post!
    }

    type User {
         id: ID!
         name: String!
         email: String!
         age: Int
         posts: [Post!]!
    }

    type Post {
        id: ID!
        title: String!
        body: String!
        published: Boolean!
        author: User!
    }
`

// Resolvers for the API
const resolvers = {
    Query: {
        users(parent,args,ctx,info) {
            if (!args.query) {
                return users;
            };
            return users.filter((user) => {
                return user.name.toLowerCase().includes(args.query.toLowerCase());
            });
        },
        posts(parent,args,ctx,info) {
            if (!args.query) {
                return posts
            };
            return posts.filter( (post) => { 
                let titleMatches = post.title.toLowerCase().includes(args.query.toLowerCase());
                let bodyMatches = post.body.toLowerCase().includes(args.query.toLowerCase());
                return titleMatches || bodyMatches;
            });
        },
        me() {
            return {
                id: '123098',
                name: 'Christian',
                email: 'Christian@gmail.com',
                age:20
            }
        },
        post() {
            return {
                id: 'whatevs123',
                title: 'Welcome to GQL',
                body: 'It is awesome, you should use it!',
                published: true
            }
        }
        
    },
    Post: {
        author(parent,args,ctx,info) {
            return users.find((user) => {
                return user.id === parent.author
            });
        }   
    },
    User: {
        posts(parent,args,ctx,info) {
            return posts.filter((post) => {
                return post.author === parent.id;
            });
        } 
    }
};

const server = new GraphQLServer({
    typeDefs,
    resolvers
});

server.start(() => { 
    console.log('Server is up and running...')
});