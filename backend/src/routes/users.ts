import express from 'express';
import { Request, Response } from "express";
import { Like, Not, getRepository } from "typeorm";
import { Bookmarks, Messages, Music, Notes, Photo, Users } from '../entity';
import { verifyAuthToken } from '../middleware/verify-auth-token';

const getUserById = async (req: Request, res: Response) => {
    const decodedAuthToken = await verifyAuthToken(req.cookies.AUTH_TOKEN);

    if (!decodedAuthToken) {
        return res.status(401).send();
    }

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
    const decodedAuthToken = await verifyAuthToken(req.cookies.AUTH_TOKEN);

    if (!decodedAuthToken) {
        return res.status(401).send();
    }
    
    const userRepository = getRepository(Users);
    const user = await userRepository.findOne({
        id: +req.params.id || decodedAuthToken.id
    });

    if (!user) return res.status(400).send();

    delete user.password;
    return res.status(200).json(user);
}

const search = async (req: Request, res: Response) => {
    const decodedAuthToken = await verifyAuthToken(req.cookies.AUTH_TOKEN);

    if (!decodedAuthToken) {
        return res.status(401).send();
    }

    const userRepository = getRepository(Users);
    const users = await userRepository.find({
        select: ["id", "name", "country", "city", "avatar", "status"],
        where: {
            name: Like(`%${req.body.name}%`),
            id: Not(decodedAuthToken.id)
        }
    });

    return res.status(200).json(users);
}

const setAvatar = async (req: Request, res: Response) => {
    const decodedAuthToken = await verifyAuthToken(req.cookies.AUTH_TOKEN);

    if (!decodedAuthToken) {
        return res.status(401).send();
    }

    const userRepository = getRepository(Users);
    const user = await userRepository.findOne({ id: decodedAuthToken.id });

    if (!user) {
        return res.status(401).send();
    }

    const newAvatar = { avatar: req.body.avatar };
    userRepository.merge(user, newAvatar);
    await userRepository.save(user);

    return res.status(200).send();
}

const changeBasicInfo = async (req: Request, res: Response) => {
    const decodedAuthToken = await verifyAuthToken(req.cookies.AUTH_TOKEN);

    if (!decodedAuthToken) {
        return res.status(401).send();
    }

    const userRepository = getRepository(Users);
    const user = await userRepository.findOne({ id: decodedAuthToken.id });
    const { firstName, lastName, birthday, familyStatus, country, city } = req.body;

    if (!user) {
        return res.status(401).send();
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

    return res.status(200).send();
}

const changeAboutSelfInfo = async (req: Request, res: Response) => {
    const decodedAuthToken = await verifyAuthToken(req.cookies.AUTH_TOKEN);

    if (!decodedAuthToken) {
        return res.status(401).send();
    }

    const userRepository = getRepository(Users);
    const user = await userRepository.findOne({ id: decodedAuthToken.id });

    if (!user) {
        return res.status(401).send();
    }

    const newInfo = { 
        activity: req.body.activity,
        interests: req.body.interests,
        hobby: req.body.hobby,
        about_self: req.body.aboutSelf
    };

    userRepository.merge(user, newInfo);
    await userRepository.save(user);

    return res.status(200).send();
}

const deletePage = async (req: Request, res: Response) => {
    const decodedAuthToken = await verifyAuthToken(req.cookies.AUTH_TOKEN);

    if (!decodedAuthToken) {
        return res.status(401).send();
    }

    const bookmarkRepository = getRepository(Bookmarks);
    const messageRepository = getRepository(Messages);
    const musicRepository = getRepository(Music);
    const noteRepository = getRepository(Notes);
    const photoRepository = getRepository(Photo);
    const userRepository = getRepository(Users);

    const userId = decodedAuthToken.id;

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
    router.get('/get_user_data/:id?', getUserData);
    router.post('/search/', search);
    router.post('/set_avatar/', setAvatar);
    router.put('/change_basic_info', changeBasicInfo);
    router.put('/change_about_self_info', changeAboutSelfInfo);
    router.delete('/delete_page', deletePage);

    return router;
}
