import express from 'express';
import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Notes } from '../entity/Notes';
import { verifyAuthToken } from '../middleware/verify-auth-token';

const getNotes = async (req: Request, res: Response) => {
    const decodedAuthToken = await verifyAuthToken(req.cookies.AUTH_TOKEN);

    if (!decodedAuthToken) {
        return res.status(401).send();
    }

    const noteRepository = getRepository(Notes);
    const notes = await noteRepository.find({ userId: decodedAuthToken.id });

    return res.json(notes);
}

const createNote = async (req: Request, res: Response) => {
    const user = await verifyAuthToken(req.cookies.AUTH_TOKEN);

    if (!user) {
        return res.status(401).send();
    }

    const noteRepository = getRepository(Notes);
    const note = await noteRepository.create({
        userId: user.id,
        header: req.body.header,
        content: req.body.content
    });
    await noteRepository.save(note);

    return res.status(200).send("Success");
}

const changeNote = async (req: Request, res: Response) => {
    const user = await verifyAuthToken(req.cookies.AUTH_TOKEN);

    if (!user) {
        return res.status(401).send();
    }

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
    const user = await verifyAuthToken(req.cookies.AUTH_TOKEN);

    if (!user) {
        return res.status(401).send();
    }

    const noteRepository = getRepository(Notes);
    await noteRepository.delete({ id: +req.params.id });

    return res.sendStatus(200).end();
}

export function noteRouter() {
    const router = express.Router();

    router.get('/', getNotes);
    router.post('/', createNote);
    router.put('/:id', changeNote);
    router.delete('/:id', deleteNote);

    return router;
}
