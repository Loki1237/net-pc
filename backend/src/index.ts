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
import { musicRouter } from './routes/music';

dotenv.config();

createConnection().then(() => {
    const app = express();
    const port = 3001;

    app.use(cookieParser());
    app.use(bodyParser.json());
    app.use('/api/avatars', express.static("avatars"));
    app.use('/api/audio', express.static("audio"));

    app.use('/api/auth', authRouter());
    app.use('/api/users', userRouter());
    app.use('/api/bookmarks', bookmarkRouter());
    app.use('/api/notes', noteRouter());
    app.use('/api/messages', messageRouter());
    app.use('/api/music', musicRouter());

    app.listen(port, () => console.log(`Server is runned on port ${port}`));

});
