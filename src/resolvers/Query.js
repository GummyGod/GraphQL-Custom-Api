const Query = {
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
    
}

export default Query;