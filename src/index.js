import { GraphQLServer } from 'graphql-yoga';
import uuidv4 from 'uuid/v4';

import db from './db';

// Resolvers for the API
const resolvers = {
    Query: {
        users(parent,args,{ db },info) {
            if (!args.query) {
                return db.users;
            };
            return db.users.filter((user) => {
                return user.name.toLowerCase().includes(args.query.toLowerCase());
            });
        },
        posts(parent,args,{ db },info) {
            if (!args.query) {
                return db.posts
            };
            return db.posts.filter( (post) => { 
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
        comments(parent,args,{ db },info) {
            return db.comments;
        }
        
    },
    Mutation: {
        createUser(parent,args,{ db },info) {
            const emailTaken = db.users.some((user) => user.email === args.data.email);
            
            if (emailTaken) throw new Error('Email is already taken! Please chose another!');

            const user = {
                id: uuidv4(),
                ...args.data
            };

            db.users.push(user);

            return user

        },
        deleteUser(parents,args,{ db },info) {
            const userIndex = db.users.findIndex((user) => user.id === args.id);

            if (userIndex === -1 ) {
                throw new Error('User not found');
            }

            const deletedUsers = db.users.splice(userIndex, 1);

            db.posts = db.posts.filter((post) => {
                const match = post.author === args.id;

                if (match) {
                    //delete all the comments on user posts
                    db.comments = db.comments.filter((comment) => comment.post !== post.id)
                }
                
                return !match 
            });
            //delete all the comments user created
            db.comments = db.comments.filter((comment) => comment.author !== args.id)

            return deletedUsers[0];
        },
        createPost(parent,args,{ db },info) {
            const userExists = db.users.some((user) => user.id === args.data.author);
            
            if (!userExists) throw new Error('User not found');
            
            const post = {
                id: uuidv4(),
                ...args.data
            };

            db.posts.push(post);

            return post;
        },
        deletePost(parent,args,ctx,info) {
            const postIndex = db.posts.findIndex((post) => post.id === args.id);

            if(postIndex === -1) throw new Error('Post not found');

            const deletedPosts = db.posts.splice(postIndex, 1);

            db.comments = db.comments.filter((comment) => comment.post !== args.id);

            return deletedPosts[0];

        },
        createComment(parent,args,{db},info) {
            const userExists = db.users.some((user) => user.id === args.data.author);
            const postExists = db.posts.some((post) => post.id === args.data.post && post.published);

            if (!userExists || !postExists) throw new Error('User or Post not found');
            
            const comment = {
                id: uuidv4(),
                ...args.data,
            };

            db.comments.push(comment);

            return comment;

        },
        deleteComment(parent,args,{ db },info) {
            const commentIndex = db.comments.findIndex((comment) => comment.id === args.id);
    
            if (commentIndex === -1 ) throw new Error('Comment not found');

            const deletedComment = db.comments.splice(commentIndex, 1);

            return deletedComment[0];
        }
    },
    Post: {
        author(parent,args,{ db },info) {
            return udb.users.find((user) => {
                return user.id === parent.author
            });
        },
        comments(parent,args,{ db },info) {
            return db.comments.filter((comment) => {
                return comment.post === parent.id;
            })
        }   
    },
    User: {
        posts(parent,args,{ db },info) {
            return db.posts.filter((post) => {
                return post.author === parent.id;
            });
        },
        comments(parent,args,{ db },info) {
            return db.comments.filter((comment) => {
                return comment.author === parent.id;
            })
        } 
    },
    Comment: {
        author(parent,args,{ db },info) {
            return db.users.find((user) => {
                return user.id === parent.author;
            });
        },
        post(parent,args,{ db },info) {
            return db.posts.find((post) => {
                return post.id === parent.post;
            })
        }
    }
};

const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers,
    context: {
        db
    }
});

server.start(() => { 
    console.log('Server is up and running...')
});