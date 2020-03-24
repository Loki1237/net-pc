import express from 'express';
import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Bookmarks } from '../entity/Bookmarks';

const getBookmark = async (req: Request, res: Response) => {
    const bookmarkRepository = getRepository(Bookmarks);
    const bookmarks = await bookmarkRepository.find({
        userId: parseInt(req.params.userId)
    });

    return res.json(bookmarks);
}

const createBookmark = async (req: Request, res: Response) => {
    const bookmarkRepository = getRepository(Bookmarks);
    const bookmark = await bookmarkRepository.create({
        userId: req.body.userId,
        name: req.body.name,
        url: req.body.url
    });
    await bookmarkRepository.save(bookmark);

    return res.sendStatus(200).end();
}

const changeBookmark = async (req: Request, res: Response) => {
    const bookmarkRepository = getRepository(Bookmarks);
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
}

const deleteBookmark = async (req: Request, res: Response) => {
    const bookmarkRepository = getRepository(Bookmarks);
    await bookmarkRepository.delete({ id: req.body.id });

    return res.sendStatus(200).end();
}

export function bookmarkRouter() {
    const router = express.Router();

    router.get('/:userId', getBookmark);
    router.post('/', createBookmark);
    router.put('/:id', changeBookmark);
    router.delete('/', deleteBookmark);

    return router;
}
