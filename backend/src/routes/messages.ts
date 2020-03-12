import express from 'express';
import { Request, Response } from 'express';
import { createConnection } from 'typeorm';
import { getManager } from "typeorm";
import { Messages } from '../entity/Messages';

const router = express.Router();

createConnection().then(connection => {
    const messageRepository = connection.getRepository(Messages);

    router.get('/get_dialog_list/:userId', async (req: Request, res: Response) => {
        const userId = parseInt(req.params.userId);

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
    });

    router.post('/get_dialog_messages', async (req: Request, res: Response) => {
        const userId = parseInt(req.body.userId);
        const targetId = parseInt(req.body.targetId);

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
    });

    router.post('/send', async (req: Request, res: Response) => {
        const message = await messageRepository.create({
            userId: req.body.userId,
            targetId: req.body.targetId,
            content: req.body.content,
            timestamp: `${new Date().getTime()}`
        });
        await messageRepository.save(message);

        return res.status(200).send("Success");
    });

});

export default router;
