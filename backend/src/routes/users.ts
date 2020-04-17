import express from 'express';
import fs from 'fs';
import { Request, Response } from "express";
import { Like, Not, getRepository } from "typeorm";
import { Users } from '../entity/Users';
import avatarLoader from '../middleware/avatar-loader';

const getUserById = async (req: Request, res: Response) => {
    const userRepository = getRepository(Users);
    const user = await userRepository.findOne({
        select: ["id", "name", "avatar", "status"],
        where: {
            id: req.params.id
        }
    });

    return res.status(200).json(user);
}

const getUserData = async (req: Request, res: Response) => {
    const userRepository = getRepository(Users);
    const user = await userRepository.findOne({ id: +req.params.id });

    if (!user) return res.sendStatus(400).end();

    delete user.password;
    return res.status(200).json(user);
}

const search = async (req: Request, res: Response) => {
    const userRepository = getRepository(Users);
    const users = await userRepository.find({
        select: ["id", "name", "country", "city", "avatar", "status"],
        where: {
            name: Like(`%${req.body.name}%`),
            id: Not(+req.params.my_id)
        }
    });

    return res.status(200).json(users);
}

const setAvatar = async (req: Request, res: Response) => {
    const userRepository = getRepository(Users);
    const user = await userRepository.findOne({ id: +req.params.id });

    if (!user) {
        return res.sendStatus(401).end();
    }
    
    if (!req.file) {
        if (user.avatar === "default.png") {
            return res.status(400).send("The avatar is missing");
        }

        fs.unlink(`files/avatars/${user.avatar}`, async (err) => {
            if (err) {
                return res.sendStatus(400).end();
            } else {
                userRepository.merge(user, { avatar: "default.png" });
                await userRepository.save(user);

                return res.status(200).send("Avatar is deleted");
            }
        });
    }

    const avatarName = { avatar: req.file.filename };
    userRepository.merge(user, avatarName);
    await userRepository.save(user);

    return res.sendStatus(200).end();
}

const changeAboutSelfInfo = async (req: Request, res: Response) => {
    const userRepository = getRepository(Users);
    const user = await userRepository.findOne({ id: +req.params.id });

    if (!user) {
        return res.sendStatus(401).end();
    }

    const newInfo = { 
        activity: req.body.activity,
        interests: req.body.interests,
        hobby: req.body.hobby,
        about_self: req.body.aboutSelf
    };
    userRepository.merge(user, newInfo);
    await userRepository.save(user);

    return res.sendStatus(200).end();
}

export function userRouter() {
    const router = express.Router();

    router.get('/get_by_id/:id', getUserById);
    router.get('/get_user_data/:id', getUserData);
    router.post('/search/:my_id', search);
    router.post('/set_avatar/:id', avatarLoader.single("avatar"), setAvatar);
    router.put('/change_about_self_info/:id', changeAboutSelfInfo);

    return router;
}
