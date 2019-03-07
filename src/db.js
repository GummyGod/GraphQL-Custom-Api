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

const comments = [
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

const db = {
    users,
    posts,
    comments
}

export { db as default };