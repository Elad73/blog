import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import mongoose from 'mongoose';
import cookieSession from 'cookie-session';

import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/siginin';
import { signupRouter } from './routes/signup';
import { signoutRouter } from './routes/siginout';
import { errorHandler } from './middlewares/error-handler';
import { NotFoundError } from './errors/not-found-error';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
    cookieSession({
        signed: false,
    })
);


app.use(currentUserRouter);
app.use(signinRouter);
app.use(signupRouter);
app.use(signoutRouter);

app.all('*', async (req, res) => {
    throw new NotFoundError();
});

app.use(errorHandler);

const start = async () => {
    try {
        await mongoose.connect('mongodb://auth-mongo-service:27017/auth');
        console.log("Connected to mongoDB");
    } catch (err) {
        console.error(err);
    }

    app.listen(3000, () => {
        console.log("Listeniong on port 3000!!!!!!!!!!");
    });
};

start();

