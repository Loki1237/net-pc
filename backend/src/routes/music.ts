import express from 'express';
import { Request, Response } from "express";
import { getRepository } from "typeorm";
import fs from 'fs';
import { Music } from '../entity/Music';
import audioLoader from '../middleware/music-loader';
import { verifyAuthToken } from '../middleware/verify-auth-token';

const getMusic = async (req: Request, res: Response) => {
    const decodedAuthToken = await verifyAuthToken(req.cookies.AUTH_TOKEN);

    if (!decodedAuthToken) {
        return res.status(401).send();
    }

    const musicRepository = getRepository(Music);
    const music = await musicRepository.find({
        where: {
            userId: decodedAuthToken.id
        },
        order: {
            timestamp: "DESC"
        }
    });

    return res.json(music);
}

const getTrack = async (req: Request, res: Response) => {
    const decodedAuthToken = await verifyAuthToken(req.cookies.AUTH_TOKEN);

    if (!decodedAuthToken) {
        return res.status(401).send();
    }
    
    const musicRepository = getRepository(Music);
    const track = await musicRepository.findOne({ id: +req.params.id });

    return res.json(track);
}

const createMusic = async (req: Request, res: Response) => {
    const decodedAuthToken = await verifyAuthToken(req.cookies.AUTH_TOKEN);

    if (!decodedAuthToken) {
        return res.status(401).send();
    }

    const musicRepository = getRepository(Music);
    const song = await musicRepository.create({
        ...req.body,
        userId: decodedAuthToken.id,
        url: '/api/audio/' + req.file.filename,
        timestamp: `${Date.now()}`
    });
    await musicRepository.save(song);

    return res.sendStatus(200).end();
}

const renameSong = async (req: Request, res: Response) => {
    const decodedAuthToken = await verifyAuthToken(req.cookies.AUTH_TOKEN);

    if (!decodedAuthToken) {
        return res.status(401).send();
    }
    
    const musicRepository = getRepository(Music);
    const song = await musicRepository.findOne({ id: +req.params.id });
    const { artist, name } = req.body;

    if (!song || song.userId !== decodedAuthToken.id) {
        return res.sendStatus(400).end();
    }
    
    musicRepository.merge(song, { artist, name });
    await musicRepository.save(song);

    return res.sendStatus(200).end();
}

const deleteMusic = async (req: Request, res: Response) => {
    const decodedAuthToken = await verifyAuthToken(req.cookies.AUTH_TOKEN);

    if (!decodedAuthToken) {
        return res.status(401).send();
    }

    const musicRepository = getRepository(Music);
    const song = await musicRepository.findOne({ id: +req.params.id });

    if (!song || song.userId !== decodedAuthToken.id) {
        return res.sendStatus(400);
    }
    
    fs.unlink(`files/audio/${song.url}`, async (err) => {
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

    router.get('/', getMusic);
    router.get('/get_one/:id', getTrack);
    router.post('/', audioLoader.single("audio"), createMusic);
    router.put('/:id', renameSong);
    router.delete('/:id', deleteMusic);

    return router;
}
