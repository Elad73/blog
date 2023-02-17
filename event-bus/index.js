const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

const events = []; // structure for saving all of the events in memory

/** POST for saving events and publishing them out
 * 
 */
app.post('/events', (req, res) => {
    const event = req.body;
    console.log(event);

    events.push(event); // storing the upcoming event in the data store

    axios.post('http://posts-clusterip-service:4000/events', event);
    // axios.post('http://localhost:4001/events', event);
    // axios.post('http://localhost:4002/events', event);
    // axios.post('http://localhost:4003/events', event);

    res.send({ status: 'OK' });
});

/** GET all the events on the data store
 * 
 */
app.get('/events', (req, res) => {
    res.send(events);
});

app.listen(4005, () => {
    console.log('Listening on 4005');
});