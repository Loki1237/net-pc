import express from 'express';
import fs from 'fs';
import { Request, Response } from "express";
import { createConnection, Like, Not, getRepository } from "typeorm";
import { Users } from '../entity/Users';
import { UserInfo } from '../entity/UserInfo';
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
    const user = await userRepository.findOne({
        select: ["name", "email", "gender", "birthday", "country", "city", "family_status", "avatar", "status"],
        where: {
            id: req.params.id
        }
    });

    return res.status(200).json(user);
}

const getUserInfo = async (req: Request, res: Response) => {
    const userInfoRepository = getRepository(UserInfo);
    const userInfo = await userInfoRepository.find({
        where: { userId: parseInt(req.params.userId) },
        order: { type: "DESC" }
    });

    return res.status(200).json(userInfo);
}

const search = async (req: Request, res: Response) => {
    const userRepository = getRepository(Users);
    const users = await userRepository.find({
        select: ["id", "name", "country", "city", "avatar", "status"],
        where: {
            name: Like(`%${req.body.name}%`),
            id: Not(parseInt(req.params.my_id))
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

        fs.unlink(`avatars/${user.avatar}`, async (err) => {
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

export function userRouter() {
    const router = express.Router();

    router.get('/get_by_id/:id', getUserById);
    router.get('/get_user_data/:id', getUserData);
    router.get('/get_user_info/:userId', getUserInfo);
    router.post('/search/:my_id', search);
    router.post('/set_avatar/:id', avatarLoader.single("avatar"), setAvatar);

    return router;
}
