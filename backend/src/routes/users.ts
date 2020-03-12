import express from 'express';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import { Request, Response } from "express";
import { createConnection, Like, Not } from "typeorm";
import { Users } from '../entity/Users';
import { UserInfo } from '../entity/UserInfo';
import bcrypt from 'bcrypt';
import AuthService from '../services/auth';

const router = express.Router();

const saltRounds = 12;

const storageConfig = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "avatars");
    },
    filename: (req, file, cb) => {
        cb(null, `id:${req.params.userId}${path.extname(file.originalname)}`);
    }
});

const imageFilter = (req: Request, file: any, cb: any) => {
    const type = file.mimetype;
  
    if (type === "image/png" || type === "image/jpg"|| type === "image/jpeg") {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

const avatarSaver =  multer({ storage: storageConfig, fileFilter: imageFilter });

createConnection().then(connection => {
    const userRepository = connection.getRepository(Users);
    const userInfoRepository = connection.getRepository(UserInfo);

    router.get('/get_by_id/:id', async (req: Request, res: Response) => {
        const user = await userRepository.findOne({
            select: ["id", "name", "avatar", "status"],
            where: {
                id: req.params.id
            }
        });

        return res.status(200).json(user);
    });

    router.post('/search/:my_id', async (req: Request, res: Response) => {
        const users = await userRepository.find({
            select: ["id", "name", "country", "city", "avatar", "status"],
            where: {
                name: Like(`%${req.body.name}%`),
                id: Not(parseInt(req.params.my_id))
            }
        });

        return res.status(200).json(users);
    });

    router.get('/get_user_info/:userId', async (req: Request, res: Response) => {
        const userInfo = await userInfoRepository.find({
            where: { userId: parseInt(req.params.userId) },
            order: { type: "DESC" }
        });

        return res.status(200).json(userInfo);
    });

    router.post('/sign-up', async (req: Request, res: Response) => {
        const passwordHash = await bcrypt.hash(req.body.password, saltRounds);
        const user = await userRepository.create({
            name: req.body.name,
            email: req.body.email,
            password: passwordHash,
            gender: req.body.gender,
            birthday: req.body.birthday,
            country: req.body.country,
            city: req.body.city,
            family_status: req.body.familyStatus,
            avatar: "default.png",
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

    router.get('/logout', (req: Request, res: Response) => {
        return res.status(200)
                  .header('Set-cookie', `JWT=0; max-age=0`)
                  .end();
    });

    router.post('/set_avatar/:userId', avatarSaver.single("avatar"), async (req: Request, res: Response) => {
        if (req.file) {
            try {
                const authServiceInstance = new AuthService();
                const { user } = await authServiceInstance.loginAs(req.cookies.JWT, userRepository);

                const avatarName = { avatar: req.file.filename };
                userRepository.merge(user, avatarName);
                await userRepository.save(user);

                return res.sendStatus(200).end();
            } catch {
                return res.sendStatus(401).end();
            }
        } else {
            res.sendStatus(400).end();
        }
    });

    router.post('/delete_avatar', (req: Request, res: Response) => {
        if (req.body.avatar !== "default.png") {
            fs.unlink(`avatars/${req.body.avatar}`, async (err) => {
                if (err) {
                    return res.sendStatus(400).end();
                } else {
                    const authServiceInstance = new AuthService();
                    const { user } = await authServiceInstance.loginAs(req.cookies.JWT, userRepository);

                    userRepository.merge(user, { avatar: "default.png" });
                    await userRepository.save(user);

                    return res.sendStatus(200).end();
                }
            })
        } else {
            return res.status(400).send("No avatar").end();
        }
    });

    router.put('/set_status/:id', async (req: Request, res: Response) => {
        const user = await userRepository.findOne({ id: parseInt(req.params.id) });

        if (user) {
            userRepository.merge(user, { status: req.body.online ? "online" : "offline" });
            await userRepository.save(user);
        } else {
            return res.sendStatus(400).end();
        }
        
        return res.sendStatus(200).end();
    });

});

export default router;
