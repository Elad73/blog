const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // for requests to other services
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// QUICK EXAMPLE
// posts === {
//     'sdf23': {
//         id: 'sdf23',
//         title: 'post title',
//         comments: [
//             {id: 'joi3', content: 'comment1'}
//             {id: 'i8ns', content: 'comment2'}
//         ]
//     },
//     'p9sv': {
//         id: 'p9sv',
//         title: 'post2 title',
//         comments: [
//             {id: 'o43s', content: 'comment1'}
//             {id: 'qm99', content: 'comment2'}
//         ]
//     },
// }
// structure for saving all of the post in memory
const posts = {};

const handleEvent = (type, data) => {
    if (type === 'PostCreated') {
        const { id, title } = data;

        posts[id] = { id, title, comments: [] };
    }

    if (type === 'CommentCreated') {
        const { id, content, postId, status } = data;

        const post = posts[postId];
        post.comments.push({ id, content, status });
    }

    if (type === 'CommentUpdated') {
        const { id, postId, status, content } = data;

        const post = posts[postId];
        const comment = post.comments.find(comment => {
            return comment.id === id;
        });
        
        comment.status = status;
        comment.content = content;
    }    
}

app.get('/posts', (req, res) => {
    res.send(posts);
});

/** POST for events subscribe and handling
 * 
 */
app.post('/events', (req, res) => {
    const { type, data } = req.body;

    handleEvent(type, data);
    console.log(posts);

    res.send({});
});

app.listen(4002, async () => {
    console.log('Listening on 4002');

    const res = await axios.get('http://event-bus-service:4005/events');

    for (let event of res.data) {
        console.log('Processing event:', event.type);

        handleEvent(event.type, event.data);
    }
});