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

const changeNote = async (req: Request, res: Response) => {
    const noteRepository = getRepository(Notes);
    const note = await noteRepository.findOne({
        id: +req.params.id
    });

    if (!note) {
        return res.sendStatus(400).end();
    }
    
    noteRepository.merge(note, req.body);
    await noteRepository.save(note);

    return res.sendStatus(200).end();
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
    router.put('/:id', changeNote);
    router.delete('/', deleteNote);

    return router;
}
