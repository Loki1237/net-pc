import express from 'express';
import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Notes } from '../entity/Notes';

const getNote = async (req: Request, res: Response) => {
    const noteRepository = getRepository(Notes);
    const notes = await noteRepository.find({ userId: parseInt(req.params.userId) });

    return res.json(notes);
}

const createNote = async (req: Request, res: Response) => {
    const noteRepository = getRepository(Notes);
    const note = await noteRepository.create(req.body);
    await noteRepository.save(note);

    return res.status(200).send("Success");
}

const deleteNote = async (req: Request, res: Response) => {
    const noteRepository = getRepository(Notes);
    await noteRepository.delete({ id: req.body.id });

    return res.sendStatus(200).end();
}

export function noteRouter() {
    const router = express.Router();

    router.get('/:userId', getNote);
    router.post('/', createNote);
    router.delete('/', deleteNote);

    return router;
}
