import express from 'express';
import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Messages } from '../entity/Messages';
import { Users } from '../entity/Users';
import { verifyAuthToken } from '../middleware/verify-auth-token';

const getUserList = async (req: Request, res: Response) => {
    const decodedAuthToken = await verifyAuthToken(req.cookies.AUTH_TOKEN);

    if (!decodedAuthToken) {
        return res.status(401).send();
    }

    const userId = decodedAuthToken.id;
    const userRepository = getRepository(Users);
    const userUniqueMessages = await getRepository(Messages)
        .createQueryBuilder("message")
        .select(["message.userId", "message.targetId"])
        .distinctOn(["message.userId", "message.targetId"])
        .where("message.userId = :userId OR message.targetId = :userId", { userId })
        .getMany();

    const idArray: {id: number}[] = [];

    for (let message of userUniqueMessages) {
        if (message.userId !== userId) {
            idArray.push({ id: message.userId });
        } else {
            idArray.push({ id: message.targetId });
        }
    }

    const users = await userRepository.find({
        select: ["id", "name", "avatar", "status"],
        where: idArray
    });

    return res.status(200).json(users).end();
}

const getMessages = async (req: Request, res: Response) => {
    const decodedAuthToken = await verifyAuthToken(req.cookies.AUTH_TOKEN);

    if (!decodedAuthToken) {
        return res.status(401).send();
    }

    const messageRepository = getRepository(Messages);
    const userId = decodedAuthToken.id;
    const targetId = +req.params.targetId;

    const messages = await messageRepository.find({
        where: [
            { userId: userId, targetId: targetId },
            { userId: targetId, targetId: userId }
        ],
        order: {
            timestamp: "ASC"
        }
    });

    return res.json(messages);
}

const sendMessage = async (req: Request, res: Response) => {
    const decodedAuthToken = await verifyAuthToken(req.cookies.AUTH_TOKEN);

    if (!decodedAuthToken) {
        return res.status(401).send();
    }

    const messageRepository = getRepository(Messages);
    const message = await messageRepository.create({
        userId: decodedAuthToken.id,
        targetId: req.body.targetId,
        content: req.body.content,
        timestamp: `${new Date().getTime()}`
    });
    await messageRepository.save(message);

    return res.status(200).json(message);
}

export function messageRouter() {
    const router = express.Router();

    router.get('/get_users', getUserList);
    router.get('/get_messages/:targetId', getMessages);
    router.post('/send', sendMessage);

    return router;
}
