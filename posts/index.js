const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto'); // to generate a new ID to be assigned to a new post
const cors = require('cors'); // for requests to other services
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// structure for saving all of the post in memory
const posts = {};

/** Getting all posts
 * 
 */
app.get('/posts', (req, res) => {
    res.send(posts);
});

/** Creating new post
 * 
 */
app.post('/posts', async (req, res) => {
    const id = randomBytes(4).toString('hex'); 
    const { title } = req.body;

    posts[id] = {
        id, title
    };

    await axios.post('http://localhost:4005/events', {
        type: 'PostCreated',
        data: {
            id,
            title
        }
    });

    res.status(201).send(posts[id]); // 201 = created a resource
});

/** Creating event
 * 
 */
app.post('/events', (req, res) => {
    console.log('Received Event', req.body.type);

    res.send({})
});

app.listen(4000, () => {
    console.log('Listening on port 4000');
});