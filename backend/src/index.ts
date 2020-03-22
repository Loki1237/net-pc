import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

import { createConnection } from 'typeorm';
import 'reflect-metadata';
import dotenv from 'dotenv';

import { authRouter } from './routes/auth';
import { userRouter } from './routes/users';
import { bookmarkRouter } from './routes/bookmarks';
import { noteRouter } from './routes/notes';
import { messageRouter } from './routes/messages';

dotenv.config();

createConnection().then(() => {
    const app = express();
    const port = 3001;

    app.use(bodyParser.json());
    app.use(cookieParser());
    app.use('/api/avatars', express.static("avatars"));
    app.use('/api/auth', authRouter());
    app.use('/api/users', userRouter());
    app.use('/api/bookmarks', bookmarkRouter());
    app.use('/api/notes', noteRouter());
    app.use('/api/messages', messageRouter());

    app.listen(port, () => console.log(`Server is runned on port ${port}`));

});