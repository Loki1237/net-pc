import express from 'express';
import { Request, Response } from "express";
import { createConnection } from "typeorm";
import { Bookmarks } from '../entity/Bookmarks';

const router = express.Router();

createConnection().then(connection => {
    const bookmarkRepository = connection.getRepository(Bookmarks);

    router.get('/:userId', async (req: Request, res: Response) => {
        const bookmarks = await bookmarkRepository.find({
            userId: parseInt(req.params.userId)
        });

        return res.json(bookmarks);
    });

    router.post('/', async (req: Request, res: Response) => {
        if (req.body.type === "link" || req.body.type === "user") {
            const bookmark = await bookmarkRepository.create({
                userId: req.body.userId,
                name: req.body.name,
                url: req.body.url
            });
            await bookmarkRepository.save(bookmark);

            return res.sendStatus(200).end();
        } else {
            return res.sendStatus(400).end();
        }
    });

    router.put('/:id', async (req: Request, res: Response) => {
        const bookmark = await bookmarkRepository.findOne({
            id: parseInt(req.params.id)
        });
        
        if (bookmark) {
            bookmarkRepository.merge(bookmark, {
                name: req.body.name,
                url: req.body.url
            });
            await bookmarkRepository.save(bookmark);

            return res.sendStatus(200).end();
        } else {
            return res.sendStatus(400).end();
        }
    });

    router.delete('/', async (req: Request, res: Response) => {
        await bookmarkRepository.delete({ id: req.body.id });

        return res.sendStatus(200).end();
    });

});

export default router;
