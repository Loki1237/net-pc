import express from 'express';
import { Request, Response } from "express";
import { getRepository } from "typeorm";
import fs from 'fs';
import path from 'path';
import { Music } from '../entity';
import audioLoader from '../middleware/music-loader';
import { verifyAuthToken } from '../middleware/verify-auth-token';
import { parseFile } from 'music-metadata';

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

    for (let file of req.files) {
        const metadata = await parseFile(file.path);
        let duration = "0";

        if (metadata.format.duration) {
            const ms = Math.floor(metadata.format.duration * 1000);
            const date = new Date(ms);

            let minutes = date.getMinutes();
            let seconds = `${date.getSeconds()}`;
            if (seconds.length < 2) seconds = `0${seconds}`;

            duration = `${minutes}:${seconds}`;
        }

        const extname = new RegExp(`${path.extname(file.originalname)}$`);
        const track = await musicRepository.create({
            name: file.originalname.replace(extname, ""),
            userId: decodedAuthToken.id,
            url: '/api/audio/' + file.filename,
            timestamp: `${Date.now()}`,
            duration
        });
        await musicRepository.save(track);
    }

    return res.status(200).send();
}

const renameTrack = async (req: Request, res: Response) => {
    const decodedAuthToken = await verifyAuthToken(req.cookies.AUTH_TOKEN);

    if (!decodedAuthToken) {
        return res.status(401).send();
    }
    
    const musicRepository = getRepository(Music);
    const track = await musicRepository.findOne({ id: +req.params.id });

    if (!track || track.userId !== decodedAuthToken.id) {
        return res.status(400).send();
    }
    
    musicRepository.merge(track, { name: req.body.name });
    await musicRepository.save(track);

    return res.status(200).send();
}

const deleteMusic = async (req: Request, res: Response) => {
    const decodedAuthToken = await verifyAuthToken(req.cookies.AUTH_TOKEN);

    if (!decodedAuthToken) {
        return res.status(401).send();
    }

    const musicRepository = getRepository(Music);
    const track = await musicRepository.findOne({ id: +req.params.id });

    if (!track || track.userId !== decodedAuthToken.id) {
        return res.status(400).send();
    }
    
    const fileName = track.url.replace(/^\/api\/audio\//, "");
    fs.unlink(`files/audio/${fileName}`, async (err) => {
        if (err) {
            return res.status(400).send();
        } else {
            await musicRepository.delete({ id: +req.params.id });

            return res.status(200).send();
        }
    });

    return res.status(200).send();
}

export function musicRouter() {
    const router = express.Router();

    router.get('/', getMusic);
    router.get('/get_one/:id', getTrack);
    router.post('/', audioLoader.array("audio"), createMusic);
    router.put('/:id', renameTrack);
    router.delete('/:id', deleteMusic);

    return router;
}
