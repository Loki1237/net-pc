import express from 'express';
import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Friend, User, Profile } from '../entity';
import { verifyAuthToken } from '../middleware/verify-auth-token';

const getUserPage = async (req: Request, res: Response) => {
    const decodedAuthToken = await verifyAuthToken(req.cookies.AUTH_TOKEN);

    if (!decodedAuthToken) {
        return res.status(401).send();
    }
    
    const userRepository = getRepository(User);
    const user = await userRepository.findOne({
        where: {
            id: +req.params.id || decodedAuthToken.id
        },
        relations: ["profile", "photos"]
    });

    if (!user) return res.status(400).send();

    delete user.password;

    if (!req.params.id || +req.params.id === decodedAuthToken.id) {
        return res.status(200).json({ user, owner: "i" }).send();
    }

    const friendRepository = getRepository(Friend);
    const friendRequest = await friendRepository.findOne({
        where: [
            { user1Id: decodedAuthToken.id, user2Id: +req.params.id },
            { user2Id: decodedAuthToken.id, user1Id: +req.params.id }
        ]
    });

    if (!friendRequest || !friendRequest.confirmed) {
        return res.status(200).json({ user, owner: "any" }).send();
    }

    if (friendRequest && friendRequest.confirmed) {
        return res.status(200).json({ user, owner: "friend" }).send();
    }
}

const getUserById = async (req: Request, res: Response) => {
    const decodedAuthToken = await verifyAuthToken(req.cookies.AUTH_TOKEN);

    if (!decodedAuthToken) {
        return res.status(401).send();
    }

    const userRepository = getRepository(User);
    const user = await userRepository.findOne({
        select: ["id", "firstName", "lastName", "avatar", "online"],
        where: {
            id: req.params.id
        }
    });

    return res.status(200).json(user);
}

const search = async (req: Request, res: Response) => {
    const decodedAuthToken = await verifyAuthToken(req.cookies.AUTH_TOKEN);

    if (!decodedAuthToken) {
        return res.status(401).send();
    }

    const names = req.body.name.split(" ");

    const firstName = `%${names[0]}%`;
    const lastName = names.length >= 2 ? `%${names[1]}%` : "%%";
    const id = decodedAuthToken.id;

    const userRepository = getRepository(User);
    const users = await userRepository
        .createQueryBuilder("user")
        .select(["user.id", "user.firstName", "user.lastName", "user.avatar", "user.online"])
        .where("LOWER(user.firstName) LIKE LOWER(:firstName) AND user.id != :id", { firstName, id })
        .andWhere("LOWER(user.lastName) LIKE LOWER(:lastName)", { lastName })
        .orWhere("LOWER(user.firstName) LIKE LOWER(:lastName) AND user.id != :id", { lastName, id })
        .andWhere("LOWER(user.lastName) LIKE LOWER(:firstName)", { firstName })
        .getMany();

    return res.status(200).json(users);
}

const setAvatar = async (req: Request, res: Response) => {
    const decodedAuthToken = await verifyAuthToken(req.cookies.AUTH_TOKEN);

    if (!decodedAuthToken) {
        return res.status(401).send();
    }

    const userRepository = getRepository(User);
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

    const userRepository = getRepository(User);
    const profileRepository = getRepository(Profile);
    const user = await userRepository.findOne({ id: decodedAuthToken.id });
    const profile = await profileRepository.findOne({ user });
    const { firstName, lastName, birthday, familyStatus, country, city } = req.body;

    if (!user || !profile) {
        return res.status(401).send();
    }

    const newName = {
        firstName,
        lastName
    };

    const newInfo = {
        birthday,
        familyStatus,
        country,
        city
    };

    userRepository.merge(user, newName);
    await userRepository.save(user);
    profileRepository.merge(profile, newInfo);
    await userRepository.save(user);

    return res.status(200).send();
}

const changeAboutSelfInfo = async (req: Request, res: Response) => {
    const decodedAuthToken = await verifyAuthToken(req.cookies.AUTH_TOKEN);

    if (!decodedAuthToken) {
        return res.status(401).send();
    }

    const profileRepository = getRepository(Profile);
    const user = await profileRepository.findOne({ id: decodedAuthToken.id });

    if (!user) {
        return res.status(401).send();
    }

    const newInfo = { 
        activity: req.body.activity,
        interests: req.body.interests,
        hobby: req.body.hobby,
        aboutSelf: req.body.aboutSelf
    };

    profileRepository.merge(user, newInfo);
    await profileRepository.save(user);

    return res.status(200).send();
}

export function userRouter() {
    const router = express.Router();

    router.get('/get_by_id/:id', getUserById);
    router.get('/get_user_data/:id?', getUserPage);
    router.post('/search/', search);
    router.post('/set_avatar/', setAvatar);
    router.put('/change_basic_info', changeBasicInfo);
    router.put('/change_about_self_info', changeAboutSelfInfo);

    return router;
}
