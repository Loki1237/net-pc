import express from 'express';
import { Request, Response } from 'express';
import { WebsocketMethod } from 'express-ws';
import { getRepository } from 'typeorm';
import { Messages } from '../entity/Messages';
import { Users } from '../entity/Users';
import { verifyAuthToken } from '../middleware/verify-auth-token';
import WebSocket from 'ws';

interface Clients<T> { [key: number]: T }
const clients: Clients<WebSocket> = {};

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

const sendMessages = async (ws: WebSocket, req: Request) => {
    const decodedAuthToken = await verifyAuthToken(req.cookies.AUTH_TOKEN);

    if (!decodedAuthToken) {
        ws.close();
        return;
    }

    clients[decodedAuthToken.id] = ws;

    ws.on('message', async (message: string) => {
        const messageObject = JSON.parse(message);
        const{ targetId, content } = messageObject;

        const messageRepository = getRepository(Messages);
        const newMessage = await messageRepository.create({
            userId: decodedAuthToken.id,
            targetId,
            content,
            timestamp: `${new Date().getTime()}`
        });
        await messageRepository.save(newMessage);

        clients[decodedAuthToken.id].send(JSON.stringify(newMessage));

        if (clients[targetId]) {
            clients[targetId].send(JSON.stringify(newMessage));
        }
    });

    ws.on('close', () => {
        delete clients[decodedAuthToken.id];
    });
};

export function messageRouter() {
    const router = express.Router();

    router.get('/get_users', getUserList);
    router.get('/get_messages/:targetId', getMessages);
    router.ws('/ws_send', sendMessages);

    return router;
}
