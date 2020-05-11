import express from 'express';
import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Bookmarks } from '../entity/Bookmarks';
import { verifyAuthToken } from '../middleware/verify-auth-token';

const getBookmark = async (req: Request, res: Response) => {
    const decodedAuthToken = await verifyAuthToken(req.cookies.AUTH_TOKEN);

    if (!decodedAuthToken) {
        return res.status(401).send();
    }

    const bookmarkRepository = getRepository(Bookmarks);
    const bookmarks = await bookmarkRepository.find({ userId: decodedAuthToken.id });

    return res.json(bookmarks);
}

const createBookmark = async (req: Request, res: Response) => {
    const decodedAuthToken = await verifyAuthToken(req.cookies.AUTH_TOKEN);

    if (!decodedAuthToken) {
        return res.status(401).send();
    }

    const bookmarkRepository = getRepository(Bookmarks);
    const bookmark = await bookmarkRepository.create({
        userId: decodedAuthToken.id,
        name: req.body.name,
        url: req.body.url
    });
    await bookmarkRepository.save(bookmark);

    return res.sendStatus(200).end();
}

const changeBookmark = async (req: Request, res: Response) => {
    const decodedAuthToken = await verifyAuthToken(req.cookies.AUTH_TOKEN);

    if (!decodedAuthToken) {
        return res.status(401).send();
    }

    const bookmarkRepository = getRepository(Bookmarks);
    const bookmark = await bookmarkRepository.findOne({
        id: parseInt(req.params.id)
    });
    
    if (!bookmark || bookmark.userId !== decodedAuthToken.id) {
        return res.status(400).send();
    } 

    bookmarkRepository.merge(bookmark, {
        name: req.body.name,
        url: req.body.url
    });
    await bookmarkRepository.save(bookmark);

    return res.status(200).send();
}

const deleteBookmark = async (req: Request, res: Response) => {
    const decodedAuthToken = await verifyAuthToken(req.cookies.AUTH_TOKEN);

    if (!decodedAuthToken) {
        return res.status(401).send();
    }
    
    const bookmarkRepository = getRepository(Bookmarks);
    const bookmark = await bookmarkRepository.findOne({
        id: +req.params.id
    });

    if (!bookmark || bookmark.userId !== decodedAuthToken.id) {
        return res.status(400).send();
    }
    
    await bookmarkRepository.delete({ id: req.body.id });

    return res.status(200).send();
}

export function bookmarkRouter() {
    const router = express.Router();

    router.get('/', getBookmark);
    router.post('/', createBookmark);
    router.put('/:id', changeBookmark);
    router.delete('/:id', deleteBookmark);

    return router;
}
