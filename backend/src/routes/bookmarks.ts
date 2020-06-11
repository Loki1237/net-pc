import express from 'express';
import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Bookmark } from '../entity';
import { verifyAuthToken } from '../middleware/verify-auth-token';

const getBookmarks = async (req: Request, res: Response) => {
    const decodedAuthToken = await verifyAuthToken(req.cookies.AUTH_TOKEN);

    if (!decodedAuthToken) {
        return res.status(401).send();
    }

    const bookmarkRepository = getRepository(Bookmark);
    const bookmarks = await bookmarkRepository.find({ 
        where: {
            userId: decodedAuthToken.id
        },
        order: {
            timestamp: "DESC"
        }
    });

    return res.json(bookmarks);
}

const createBookmark = async (req: Request, res: Response) => {
    const decodedAuthToken = await verifyAuthToken(req.cookies.AUTH_TOKEN);

    if (!decodedAuthToken) {
        return res.status(401).send();
    }

    const bookmarkRepository = getRepository(Bookmark);
    const bookmark = await bookmarkRepository.create({
        userId: decodedAuthToken.id,
        name: req.body.name,
        url: req.body.url,
        timestamp: `${Date.now()}`
    });
    await bookmarkRepository.save(bookmark);

    return res.sendStatus(200).end();
}

const changeBookmark = async (req: Request, res: Response) => {
    const decodedAuthToken = await verifyAuthToken(req.cookies.AUTH_TOKEN);

    if (!decodedAuthToken) {
        return res.status(401).send();
    }

    const bookmarkRepository = getRepository(Bookmark);
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
    
    const bookmarkRepository = getRepository(Bookmark);
    const bookmark = await bookmarkRepository.findOne({
        id: +req.params.id
    });

    if (!bookmark || bookmark.userId !== decodedAuthToken.id) {
        return res.status(400).send();
    }
    
    await bookmarkRepository.delete({ id: +req.params.id });

    return res.status(200).send();
}

export function bookmarkRouter() {
    const router = express.Router();

    router.get('/', getBookmarks);
    router.post('/', createBookmark);
    router.put('/:id', changeBookmark);
    router.delete('/:id', deleteBookmark);

    return router;
}
