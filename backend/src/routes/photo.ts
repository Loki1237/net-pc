import express from 'express';
import { Request, Response } from "express";
import { getRepository } from "typeorm";
import fs from 'fs';
import { Photo } from '../entity/Photo';
import photoLoader from '../middleware/photo-loader';

const getPhoto = async (req: Request, res: Response) => {
    const photoRepository = getRepository(Photo);
    const photographies = await photoRepository.find({ userId: +req.params.userId });

    return res.json(photographies);
}

const createPhoto = async (req: Request, res: Response) => {
    const photoRepository = getRepository(Photo);
    const photo = await photoRepository.create({
        userId: +req.params.userId,
        url: req.file.filename,
        timestamp: `${Date.now()}`
    });
    await photoRepository.save(photo);

    return res.sendStatus(200).end();
}

const deletePhoto = async (req: Request, res: Response) => {
    const photoRepository = getRepository(Photo);
    const photo = await photoRepository.findOne({ id: +req.params.id });

    if (!photo) return res.sendStatus(400);
    
    fs.unlink(`files/photo/${photo.url}`, async (err) => {
        if (err) {
            return res.sendStatus(400).end();
        } else {
            await photoRepository.delete({ id: +req.params.id });

            return res.status(200).send("Avatar is deleted");
        }
    });

    return res.sendStatus(200).end();
}

export function photoRouter() {
    const router = express.Router();

    router.get('/:userId', getPhoto);
    router.post('/:userId', photoLoader.single("photo"), createPhoto);
    router.delete('/:id', deletePhoto);

    return router;
}
