import express from 'express';
import { Request, Response } from "express";
import { Like, Not, getRepository } from "typeorm";
import { Bookmarks, Messages, Music, Notes, Photo, Users } from '../entity';

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

    const newAvatar = { avatar: req.body.avatar };
    userRepository.merge(user, newAvatar);
    await userRepository.save(user);

    return res.sendStatus(200).end();
}

const changeBasicInfo = async (req: Request, res: Response) => {
    const userRepository = getRepository(Users);
    const user = await userRepository.findOne({ id: +req.params.id });
    const { firstName, lastName, birthday, familyStatus, country, city } = req.body;

    if (!user) {
        return res.sendStatus(401).end();
    }

    const newInfo = { 
        name: firstName + " " + lastName,
        birthday,
        family_status: familyStatus,
        country,
        city
    };
    userRepository.merge(user, newInfo);
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

const deletePage = async (req: Request, res: Response) => {
    const bookmarkRepository = getRepository(Bookmarks);
    const messageRepository = getRepository(Messages);
    const musicRepository = getRepository(Music);
    const noteRepository = getRepository(Notes);
    const photoRepository = getRepository(Photo);
    const userRepository = getRepository(Users);

    const userId = +req.params.id;

    await userRepository.delete({ id: userId });
    await bookmarkRepository.delete({ userId });
    await messageRepository.delete({ userId: userId });
    await messageRepository.delete({ targetId: userId });
    await musicRepository.delete({ userId });
    await noteRepository.delete({ userId });
    await photoRepository.delete({ userId });

    return res.sendStatus(200).end();
}

export function userRouter() {
    const router = express.Router();

    router.get('/get_by_id/:id', getUserById);
    router.get('/get_user_data/:id', getUserData);
    router.post('/search/:my_id', search);
    router.post('/set_avatar/:id', setAvatar);
    router.put('/change_basic_info/:id', changeBasicInfo);
    router.put('/change_about_self_info/:id', changeAboutSelfInfo);
    router.delete('/delete_page/:id', deletePage);

    return router;
}
