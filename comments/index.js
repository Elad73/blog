const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto'); // to generate a new ID to be assigned to a new post
const cors = require('cors'); // for requests to other services
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// structure for saving all of the comments of posts in memory
const commentsByPostId = {};

/** Getting all comments of postId
 * 
 */
app.get('/posts/:id/comments', (req, res) => {
    res.send(commentsByPostId[req.params.id] || []);
});

/** Create new comment
 * 
 */
app.post('/posts/:id/comments', async (req, res) => {
    const commentId = randomBytes(4).toString('hex'); 
    const { content } = req.body;

    const comments = commentsByPostId[req.params.id] || [];

    comments.push({ id: commentId, content, status: 'pending' });
    commentsByPostId[req.params.id] = comments

    await axios.post('http://event-bus-service:4005/events', {
        type: 'CommentCreated',
        data: {
            id: commentId,
            content,
            postId: req.params.id,
            status: 'pending'
        }
    });


    res.status(201).send(comments); // 201 = created a resource
});

/** Creating event
 * 
 */
app.post('/events', async (req, res) => {
    console.log('Received Event', req.body.type);

    const { type, data } = req.body;

    if (type === 'CommentModerated') {
        const { id, postId, status, content } = data;
        const comments = commentsByPostId[postId];
        
        const comment = comments.find(comment => {
            return comment.id === id;
        });
        comment.status = status;

        await axios.post('http://event-bus-service:4005/events', {
            type: 'CommentUpdated',
            data: {
                id,
                status,
                postId,
                content
            }
        })


    }

    res.send({})
});

app.listen(4001, () => {
    console.log('Listening on port 4001');
});
