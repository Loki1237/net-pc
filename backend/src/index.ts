import express from 'express';
import multer from 'multer';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import homeRoute from './routes/home';
import userRoute from './routes/users';
import noteRoute from './routes/notes';
import { createConnection } from "typeorm";

const app = express();
const port = 3001;

createConnection().then(() => {

    app.use(bodyParser.json());
    app.use(cookieParser());
    app.use('/api/avatars', express.static('avatars'));
    app.use(multer({ dest:"avatars" }).single("filedata"));

    app.use('/api/', homeRoute);
    app.use('/api/users', userRoute);
    app.use('/api/notes', noteRoute);

    app.listen(port, () => console.log(`Server is runned on port ${port}`));

});