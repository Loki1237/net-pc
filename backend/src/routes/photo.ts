import express from 'express';
import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';
import fs from 'fs';
import { Photo } from '../entity/Photo';
import { Users } from '../entity/Users';
import photoLoader from '../middleware/photo-loader';
import { verifyAuthToken } from '../middleware/verify-auth-token';

const getPhotos = async (req: Request, res: Response) => {
    const decodedAuthToken = await verifyAuthToken(req.cookies.AUTH_TOKEN);

    if (!decodedAuthToken) {
        return res.status(401).send();
    }

    const photoRepository = getRepository(Photo);
    
    const photographies = await photoRepository.find({
        where: {
            userId: +req.params.userId || decodedAuthToken.id
        },
        order: {
            timestamp: "DESC"
        }
    });

    return res.json(photographies);
}

const createPhoto = async (req: Request, res: Response, next: NextFunction) => {
    const decodedAuthToken = await verifyAuthToken(req.cookies.AUTH_TOKEN);

    if (!decodedAuthToken) {
        return res.status(401).send();
    }

    const photoRepository = getRepository(Photo);
    const photo = await photoRepository.create({
        userId: decodedAuthToken.id,
        url: '/api/photo/' + req.file.filename,
        timestamp: `${Date.now()}`
    });
    await photoRepository.save(photo);

    if (req.path === '/upload_avatar') {
        next();
    }

    return res.status(200).json({ url: photo.url }).end();
}

const changeAvatar = async (req: Request, res: Response) => {
    const decodedAuthToken = await verifyAuthToken(req.cookies.AUTH_TOKEN);

    if (!decodedAuthToken) {
        return res.status(401).send();
    }

    const userRepository = getRepository(Users);
    const user = await userRepository.findOne({ id: decodedAuthToken.id });

    if (!user) {
        return res.status(401).send();
    }

    const newAvatar = { avatar: '/api/photo/' + req.file.filename };
    userRepository.merge(user, newAvatar);
    await userRepository.save(user);

    return res.status(200).send();
}

const createMultiplePhoto = async (req: Request, res: Response) => {
    const decodedAuthToken = await verifyAuthToken(req.cookies.AUTH_TOKEN);

    if (!decodedAuthToken) {
        return res.status(401).send();
    }

    const photoRepository = getRepository(Photo);

    for (const file of req.files) {
        const photo = await photoRepository.create({
            userId: decodedAuthToken.id,
            url: '/api/photo/' + file.filename,
            timestamp: `${Date.now()}`
        });
        await photoRepository.save(photo);
    }

    return res.status(200).send();
}

const deletePhoto = async (req: Request, res: Response) => {
    const decodedAuthToken = await verifyAuthToken(req.cookies.AUTH_TOKEN);

    if (!decodedAuthToken) {
        return res.status(401).send();
    }

    const photoRepository = getRepository(Photo);
    const photo = await photoRepository.findOne({ id: +req.params.id });

    if (!photo || photo.userId !== decodedAuthToken.id) {
        return res.sendStatus(400);
    }
    
    const photoName = photo.url.replace(/^\/api\/photo\//, "");
    fs.unlink(`files/photo/${photoName}`, async (err) => {
        if (err) {
            return res.sendStatus(400).end();
        } else {
            await photoRepository.delete({ id: +req.params.id });

            const userRepository = getRepository(Users);
            const user = await userRepository.findOne({ id: decodedAuthToken.id });

            if (user && user.avatar === photo.url) {
                userRepository.merge(user, { avatar: "" });
                await userRepository.save(user);
            }

            return res.status(200).send("Photo is deleted");
        }
    });

    return res.sendStatus(200).end();
}

export function photoRouter() {
    const router = express.Router();

    router.get('/:userId?', getPhotos);
    router.post('/single/', photoLoader.single("photo"), createPhoto);
    router.post('/multiple', photoLoader.array("photo"), createMultiplePhoto);
    router.post('/upload_avatar', photoLoader.single("photo"), createPhoto, changeAvatar);
    router.delete('/:id', deletePhoto);

    return router;
}
