import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import homeRoute from './routes/home';
import userRoute from './routes/users';
import messageRoute from './routes/messages';
import noteRoute from './routes/notes';
import bookmarkRoute from './routes/bookmarks';
import { createConnection } from 'typeorm';
import 'reflect-metadata';

const app = express();
const port = 3001;

createConnection().then(() => {

    app.use(bodyParser.json());
    app.use(cookieParser());
    app.use('/api/avatars', express.static("avatars"));

    app.use('/api/', homeRoute);
    app.use('/api/users', userRoute);
    app.use('/api/messages', messageRoute);
    app.use('/api/notes', noteRoute);
    app.use('/api/bookmarks', bookmarkRoute);

    app.listen(port, () => console.log(`Server is runned on port ${port}`));

});