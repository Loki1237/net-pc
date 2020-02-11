import express from 'express';
import { Request, Response } from "express";
import { createConnection } from "typeorm";
import { Users } from '../entity/Users';
import bcrypt from 'bcrypt';
import AuthService from '../services/auth';

const router = express.Router();

const saltRounds = 12;

createConnection().then(connection => {
    const userRepository = connection.getRepository(Users);

    router.get('/', async (req: Request, res: Response) => {
        const users = await userRepository.find();
        res.json(users);
    });

    router.post('/sign-up', async (req: Request, res: Response) => {
        const passwordHash = await bcrypt.hash(req.body.password, saltRounds);
        const user = await userRepository.create({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: passwordHash,
            birthday: req.body.birthday,
            avatar: "none",
            status: "offline"
        });

        await userRepository.save(user);
        
        return res.status(200).send("Success");
    });

    router.post('/login', async (req: Request, res: Response) => {
        const { email, password } = req.body;
        
        try {
            const authServiceInstance = new AuthService();
            const { user, JWT } = await authServiceInstance.login(email, password, userRepository);
            return res.status(200)
                      .header('Set-cookie', `JWT=${JWT}; max-age=2592000; httpOnly`)
                      .json(user)
                      .end();
        } catch {
            return res.sendStatus(401).end();
        }
    });

    router.post('/login-as', async (req: Request, res: Response) => {
        try {
            const authServiceInstance = new AuthService();
            const { user, JWT } = await authServiceInstance.loginAs(req.cookies.JWT, userRepository);
            return res.status(200)
                      .header('Set-cookie', `JWT=${JWT}; max-age=2592000; httpOnly`)
                      .json(user)
                      .end();
        } catch {
            return res.sendStatus(401).end();
        }
    });

    router.head('/logout', (req: Request, res: Response) => {
        return res.status(200)
                  .header('Set-cookie', `JWT=0; max-age=0`)
                  .end();
    });

    router.post('/upload-avatar', (req: Request, res: Response) => {
        console.log(req.file);

        return res.status(200);
    });

});

export default router;
