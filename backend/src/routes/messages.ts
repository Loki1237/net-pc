import express from 'express';
import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { User, Conversation, Message } from '../entity';
import { verifyAuthToken } from '../middleware/verify-auth-token';
import WebSocket from 'ws';
import _ from 'lodash';

interface Clients<T> { [key: number]: T }
const clients: Clients<WebSocket> = {};

const getConversations = async (req: Request, res: Response) => {
    const decodedAuthToken = await verifyAuthToken(req.cookies.AUTH_TOKEN);

    if (!decodedAuthToken) {
        return res.status(401).send();
    }

    const userRepository = getRepository(User);
    const user = await userRepository
        .createQueryBuilder("user")
        .select(["user.id"])
        .where("user.id = :id", { id: decodedAuthToken.id })
        .leftJoinAndSelect("user.conversations", "conversations")
        .leftJoin(
            "conversations.participants",
            "participants",
            "participants.id != :id OR conversations.isDialog = false",
            { id: decodedAuthToken.id }
        )
        .addSelect([
            "participants.id",
            "participants.firstName",
            "participants.lastName",
            "participants.avatar",
            "participants.online"
        ])
        .leftJoin("conversations.messages", "messages")
        .orderBy("messages.timestamp", "DESC")
        .getOne();

    if (!user) {
        return res.status(401).send();
    }

    return res.status(200).json(user.conversations).send();
}

const getMessages = async (req: Request, res: Response) => {
    const decodedAuthToken = await verifyAuthToken(req.cookies.AUTH_TOKEN);

    if (!decodedAuthToken) {
        return res.status(401).send();
    }

    const conversationRepository = getRepository(Conversation);
    const conversation = await conversationRepository
        .createQueryBuilder("conversation")
        .where("conversation.id = :id", { id: +req.params.conversationId })
        .leftJoinAndSelect("conversation.messages", "messages")
        .leftJoin("messages.author", "author")
        .addSelect(["author.id", "author.firstName", "author.lastName"])
        .orderBy("messages.timestamp")
        .getOne();

    if (!conversation) {
        return res.status(404).send();
    }

    return res.status(200).json(conversation.messages).send();
}

const getLastMessage = async (req: Request, res: Response) => {
    const decodedAuthToken = await verifyAuthToken(req.cookies.AUTH_TOKEN);

    if (!decodedAuthToken) {
        return res.status(401).send();
    }

    const conversationRepository = getRepository(Conversation);
    const conversation = await conversationRepository
        .createQueryBuilder("conversation")
        .where("conversation.id = :id", { id: +req.params.conversationId })
        .leftJoinAndSelect("conversation.messages", "messages")
        .leftJoin("messages.author", "author")
        .addSelect(["author.id", "author.firstName", "author.lastName"])
        .orderBy("messages.timestamp", "DESC")
        .limit(1)
        .getOne();

    if (!conversation) {
        return res.status(404).send();
    }

    return res.status(200).json(conversation.messages).send();
}

const createDialog = async (req: Request, res: Response) => {
    const decodedAuthToken = await verifyAuthToken(req.cookies.AUTH_TOKEN);

    if (!decodedAuthToken) {
        return res.status(401).send();
    }

    const userRepository = getRepository(User);
    const users = await userRepository.find({
        where: [
            { id: decodedAuthToken.id },
            { id: +req.params.id }
        ]
    });

    const conversationRepository = getRepository(Conversation);
    const conversation = await conversationRepository.findOne({
        where: [
            { name: `${decodedAuthToken.id}-${req.params.id}` },
            { name: `${req.params.id}-${decodedAuthToken.id}` }
        ],
        relations: ["participants"]
    });

    if (conversation) {
        return res.status(200).json({ id: conversation.id }).send();
    }

    const newConversation = await conversationRepository.create({
        creatorId: decodedAuthToken.id,
        isDialog: true,
        name: `${decodedAuthToken.id}-${req.params.id}`,
        timestamp: new Date(),
        participants: users
    });
    const result = await conversationRepository.save(newConversation);

    return res.status(200).json({ id: result.id }).send();
}

const createChat = async (req: Request, res: Response) => {
    const decodedAuthToken = await verifyAuthToken(req.cookies.AUTH_TOKEN);

    if (!decodedAuthToken) {
        return res.status(401).send();
    }

    const userRepository = getRepository(User);
    const user = await userRepository.findOne({ id: decodedAuthToken.id });

    if (!user) {
        return res.status(401).send();
    }

    const conversationRepository = getRepository(Conversation);
    const newConversation = await conversationRepository.create({
        creatorId: decodedAuthToken.id,
        isDialog: false,
        name: req.body.name,
        timestamp: new Date(),
        participants: [user]
    });
    await conversationRepository.save(newConversation);

    return res.status(200).send();
}

const addUsersToChat = async (req: Request, res: Response) => {
    const decodedAuthToken = await verifyAuthToken(req.cookies.AUTH_TOKEN);

    if (!decodedAuthToken) {
        return res.status(401).send();
    }

    const userRepository = getRepository(User);
    const users = await userRepository.find({ 
        where: req.body.users
    });

    const conversationRepository = getRepository(Conversation);
    const conversation = await conversationRepository.findOne({
        where: {
            id: +req.params.conversationId
        },
        relations: ["participants"]
    });

    if (!conversation || conversation.isDialog) {
        return res.status(400).send();
    }
    
    conversationRepository.merge(conversation, {
        participants: [
            ...conversation.participants,
            ...users
        ]
    });
    const result = await conversationRepository.save(conversation);

    return res.status(200).send(result.participants);
}

const deleteParticipantFromChat = async (req: Request, res: Response) => {
    const decodedAuthToken = await verifyAuthToken(req.cookies.AUTH_TOKEN);

    if (!decodedAuthToken) {
        return res.status(401).send();
    }

    const conversationRepository = getRepository(Conversation);
    const conversation = await conversationRepository.findOne({
        where: {
            id: +req.params.conversationId
        },
        relations: ["participants"]
    });

    if (!conversation || conversation.isDialog) {
        return res.status(400).send();
    }

    const participants = conversation.participants;
    const index = _.findIndex(participants, { id: req.body.userId });
    participants.splice(index, 1);
    
    conversationRepository.merge(conversation, { participants });
    const result = await conversationRepository.save(conversation);

    return res.status(200).send(result.participants);
}

const deleteDialog = async (req: Request, res: Response) => {
    const decodedAuthToken = await verifyAuthToken(req.cookies.AUTH_TOKEN);

    if (!decodedAuthToken) {
        return res.status(401).send();
    }
    
    const conversationRepository = getRepository(Conversation);
    const conversation = await conversationRepository.findOne({
        where: {
            id: +req.params.id,
            isDialog: true
        },
        relations: ["participants"]
    });

    if (!conversation) {
        return res.status(404).send();
    }

    const participants = conversation.participants;
    const index = _.findIndex(participants, { id: decodedAuthToken.id });
    participants.splice(index, 1);

    if (!participants.length) {
        await conversationRepository.delete({ id: +req.params.id });

        return res.status(200).send();
    }

    conversationRepository.merge(conversation, { participants });
    await conversationRepository.save(conversation);

    return res.status(200).send();
}

const deleteChat = async (req: Request, res: Response) => {
    const decodedAuthToken = await verifyAuthToken(req.cookies.AUTH_TOKEN);

    if (!decodedAuthToken) {
        return res.status(401).send();
    }
    
    const conversationRepository = getRepository(Conversation);
    const conversation = await conversationRepository.findOne({
        where: {
            id: +req.params.id,
            isDialog: false
        },
        relations: ["participants"]
    });

    if (!conversation) {
        return res.status(404).send();
    }

    const participants = conversation.participants;
    const index = _.findIndex(participants, { id: decodedAuthToken.id });
    participants.splice(index, 1);

    if (!participants.length || conversation.creatorId === decodedAuthToken.id) {
        await conversationRepository.delete({ id: +req.params.id });

        return res.status(200).send();
    }

    conversationRepository.merge(conversation, { participants });
    await conversationRepository.save(conversation);

    return res.status(200).send();
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
        const{ conversationId, text } = messageObject;

        const userRepository = getRepository(User);
        const user = await userRepository.findOne({ id: decodedAuthToken.id });
        
        const conversationRepository = getRepository(Conversation);
        const conversation = await conversationRepository.findOne({
            where: {
                id: conversationId
            },
            relations: ["participants"]
        });

        if (!user || !conversation) {
            return;
        }

        const messageRepository = getRepository(Message);
        const newMessage = await messageRepository.create({
            author: user,
            text,
            wasRead: false,
            timestamp: `${Date.now()}`,
            conversation
        });
        await messageRepository.save(newMessage);

        for (let user of conversation.participants) {
            if (clients[user.id]) {
                clients[user.id].send(JSON.stringify(newMessage));
            }
        }
    });

    ws.on('close', () => {
        delete clients[decodedAuthToken.id];
    });
};

export function messageRouter() {
    const router = express.Router();

    router.get('/get_conversations', getConversations);
    router.get('/get_messages/:conversationId', getMessages);
    router.get('/get_last_message/:conversationId', getLastMessage);
    router.post('/create_dialog/:id', createDialog);
    router.post('/create_chat', createChat);
    router.put('/add_users_to_chat/:conversationId', addUsersToChat);
    router.put('/delete_participant/:conversationId', deleteParticipantFromChat);
    router.delete('/delete_dialog/:id', deleteDialog);
    router.delete('/delete_chat/:id', deleteChat);
    router.ws('/ws_send', sendMessages);

    return router;
}
