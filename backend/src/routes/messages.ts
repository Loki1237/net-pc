import express from 'express';
import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { getManager } from "typeorm";
import { Messages } from '../entity/Messages';

const getDialogList = async (req: Request, res: Response) => {
    const userId = +req.params.userId;

    const userUniqueMessages = await getManager()
        .createQueryBuilder(Messages, "message")
        .select(["message.userId", "message.targetId"])
        .distinctOn(["message.userId", "message.targetId"])
        .where("message.userId = :userId OR message.targetId = :userId", { userId })
        .getMany();

    let dialogIdArray: any[] = [];

    for (let message of userUniqueMessages) {
        if (dialogIdArray.indexOf(message.userId) < 0) {
            dialogIdArray.push(message.userId)
        } 
        
        if (dialogIdArray.indexOf(message.targetId) < 0) {
            dialogIdArray.push(message.targetId)
        }
    }

    return res.json(dialogIdArray);
}

const getDialogMessage = async (req: Request, res: Response) => {
    const messageRepository = getRepository(Messages);
    const userId = +req.body.userId;
    const targetId = +req.body.targetId;

    const messages = await messageRepository.find({
        where: [
            { userId: userId, targetId: targetId },
            { userId: targetId, targetId: userId }
        ],
        order: {
            timestamp: "DESC"
        }
    });

    return res.json(messages);
}

const sendMessage = async (req: Request, res: Response) => {
    const messageRepository = getRepository(Messages);
    const message = await messageRepository.create({
        userId: req.body.userId,
        targetId: req.body.targetId,
        content: req.body.content,
        timestamp: `${new Date().getTime()}`
    });
    await messageRepository.save(message);

    return res.status(200).send("Success");
}

export function messageRouter() {
    const router = express.Router();

    router.get('/get_dialog_list/:userId', getDialogList);
    router.post('/get_dialog_messages', getDialogMessage);
    router.post('/send', sendMessage);

    return router;
}
