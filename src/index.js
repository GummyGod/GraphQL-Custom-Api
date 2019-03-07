import { GraphQLServer } from 'graphql-yoga';
import { text } from 'body-parser';
import uuidv4 from 'uuid/v4';



// Demo user data 
let users = [
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
let posts = [
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

//Dummy posts
let comments = [
    {
        id: '1',
        text: 'I dream so much And I just can\'t seem to find an answer to what I\'m looking for, in general. I can\'t keep living like this.',
        author: '1',
        post: '1'
    },
    {
        id: '2',
        text: 'It\'s breaking my heart, day by day I mean, who\'s to say... Who\'s to say you find an answer when living? What if you just die? What if life as we know it is all a game? What if we live for no reason? What if you just disappear when you die?',
        author: '2',
        post:'2'
    },
    {
        id: '3',
        text: 'Should I cling to life ? Or should I just kill myself? So many contradictions, contemplations It\'s getting harder and harder to mask my pain.',
        author: '3',
        post:'3'
    },
    {
        id: '4',
        text: 'I can\'t tell if I wanna live or if I wanna die. Please, save me.',
        author:'1',
        post:'1'
    }
    
]

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
        },
        comments(parent,args,ctx,info) {
            return comments;
        }
        
    },
    Mutation: {
        createUser(parent,args,ctx,info) {
            const emailTaken = users.some((user) => user.email === args.data.email);
            
            if (emailTaken) throw new Error('Email is already taken! Please chose another!');

            const user = {
                id: uuidv4(),
                ...args.data
            };

            users.push(user);

            return user

        },
        deleteUser(parents,args,ctx,info) {
            const userIndex = users.findIndex((user) => user.id === args.id);

            if (userIndex === -1 ) {
                throw new Error('User not found');
            }

            const deletedUsers = users.splice(userIndex, 1);

            posts = posts.filter((post) => {
                const match = post.author === args.id;

                if (match) {
                    //delete all the comments on user posts
                    comments = comments.filter((comment) => comment.post !== post.id)
                }
                
                return !match 
            });
            //delete all the comments user created
            comments = comments.filter((comment) => comment.author !== args.id)

            return deletedUsers[0];
        },
        createPost(parent,args,ctx,info) {
            const userExists = users.some((user) => user.id === args.data.author);
            
            if (!userExists) throw new Error('User not found');
            
            const post = {
                id: uuidv4(),
                ...args.data
            };

            posts.push(post);

            return post;
        },
        deletePost(parent,args,ctx,info) {
            const postIndex = posts.findIndex((post) => post.id === args.id);

            if(postIndex === -1) throw new Error('Post not found');

            const deletedPosts = posts.splice(postIndex, 1);

            comments = comments.filter((comment) => comment.post !== args.id);

            return deletedPosts[0];

        },
        createComment(parent,args,ctx,info) {
            const userExists = users.some((user) => user.id === args.data.author);
            const postExists = posts.some((post) => post.id === args.data.post && post.published);

            if (!userExists || !postExists) throw new Error('User or Post not found');
            
            const comment = {
                id: uuidv4(),
                ...args.data,
            };

            comments.push(comment);

            return comment;

        },
        deleteComment(parent,args,ctx,info) {
            const commentIndex = comments.findIndex((comment) => comment.id === args.id);
    
            if (commentIndex === -1 ) throw new Error('Comment not found');

            const deletedComment = comments.splice(commentIndex, 1);

            return deletedComment[0];
        }
    },
    Post: {
        author(parent,args,ctx,info) {
            return users.find((user) => {
                return user.id === parent.author
            });
        },
        comments(parent,args,ctx,info) {
            return comments.filter((comment) => {
                return comment.post === parent.id;
            })
        }   
    },
    User: {
        posts(parent,args,ctx,info) {
            return posts.filter((post) => {
                return post.author === parent.id;
            });
        },
        comments(parent,args,ctx,info) {
            return comments.filter((comment) => {
                return comment.author === parent.id;
            })
        } 
    },
    Comment: {
        author(parent,args,ctx,info) {
            return users.find((user) => {
                return user.id === parent.author;
            });
        },
        post(parent,args,ctx,info) {
            return posts.find((post) => {
                return post.id === parent.post;
            })
        }
    }
};

const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers
});

server.start(() => { 
    console.log('Server is up and running...')
});