import express from 'express';
import { Request, Response } from "express";
import { getRepository } from "typeorm";
import fs from 'fs';
import { Photo } from '../entity/Photo';
import photoLoader from '../middleware/photo-loader';

const getPhoto = async (req: Request, res: Response) => {
    const photoRepository = getRepository(Photo);
    
    const photographies = await photoRepository.find({
        where: {
            userId: +req.params.userId
        },
        order: {
            timestamp: "DESC"
        }
    });

    return res.json(photographies);
}

const createPhoto = async (req: Request, res: Response) => {
    const photoRepository = getRepository(Photo);
    const photo = await photoRepository.create({
        userId: +req.params.userId,
        url: '/api/photo/' + req.file.filename,
        timestamp: `${Date.now()}`
    });
    await photoRepository.save(photo);

    return res.status(200).json({ url: photo.url }).end();
}

const createMultiplePhoto = async (req: Request, res: Response) => {
    const photoRepository = getRepository(Photo);

    for (const file of req.files) {
        const photo = await photoRepository.create({
            userId: +req.params.userId,
            url: '/api/photo/' + file.filename,
            timestamp: `${Date.now()}`
        });
        await photoRepository.save(photo);
    }

    return res.status(200).send();
}

const deletePhoto = async (req: Request, res: Response) => {
    const photoRepository = getRepository(Photo);
    const photo = await photoRepository.findOne({ id: +req.params.id });

    if (!photo) return res.sendStatus(400);
    
    const photoName = photo.url.replace(/^\/api\/photo\//, "");
    fs.unlink(`files/photo/${photoName}`, async (err) => {
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
    router.post('/single/:userId', photoLoader.single("photo"), createPhoto);
    router.post('/multiple/:userId', photoLoader.array("photo"), createMultiplePhoto);
    router.delete('/:id', deletePhoto);

    return router;
}
