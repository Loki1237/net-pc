import express from 'express';
import { Request, Response } from "express";
import { getRepository } from "typeorm";
import fs from 'fs';
import { Music } from '../entity/Music';
import audioLoader from '../middleware/music-loader';

const getMusic = async (req: Request, res: Response) => {
    const musicRepository = getRepository(Music);
    const music = await musicRepository.find({ userId: +req.params.userId });

    return res.json(music);
}

const getSong = async (req: Request, res: Response) => {
    const musicRepository = getRepository(Music);
    const song = await musicRepository.findOne({ id: +req.params.id });

    return res.json(song);
}

const createMusic = async (req: Request, res: Response) => {
    console.log(req.file)
    const musicRepository = getRepository(Music);
    const song = await musicRepository.create({
        ...req.body,
        userId: req.params.userId,
        url: req.file.filename,
        timestamp: `${Date.now()}`
    });
    await musicRepository.save(song);

    return res.sendStatus(200).end();
}

const deleteMusic = async (req: Request, res: Response) => {
    const musicRepository = getRepository(Music);
    const song = await musicRepository.findOne({ id: +req.params.id });

    if (!song) return res.sendStatus(400);
    
    fs.unlink(`audio/${song.url}`, async (err) => {
        if (err) {
            return res.sendStatus(400).end();
        } else {
            await musicRepository.delete({ id: +req.params.id });

            return res.status(200).send("Avatar is deleted");
        }
    });

    return res.sendStatus(200).end();
}

export function musicRouter() {
    const router = express.Router();

    router.get('/:userId', getMusic);
    router.get('/get_one/:id', getSong);
    router.post('/:userId', audioLoader.single("audio"), createMusic);
    router.delete('/:id', deleteMusic);

    return router;
}
