import express from 'express';
import { Request, Response } from "express";
import { createConnection } from "typeorm";
import { Notes } from '../entity/Notes';

const router = express.Router();

createConnection().then(connection => {
    const noteRepository = connection.getRepository(Notes);

    router.get('/:userId', async (req: Request, res: Response) => {
        const notes = await noteRepository.find({ userId: parseInt(req.params.userId) });

        return res.json(notes);
    });

    router.post('/', async (req: Request, res: Response) => {
        const note = await noteRepository.create(req.body);
        await noteRepository.save(note);

        return res.status(200).send("Success");
    });

    router.delete('/', async (req: Request, res: Response) => {
        await noteRepository.delete({ id: req.body.id });

        return res.sendStatus(200).end();
    });

});

export default router;
