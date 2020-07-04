import express from 'express';
import { Request, Response } from "express";
import { getRepository } from "typeorm";
import fs from 'fs';
import path from 'path';
import { Music, Playlist, User } from '../entity';
import audioLoader from '../middleware/music-loader';
import { verifyAuthToken } from '../middleware/verify-auth-token';
import { parseFile } from 'music-metadata';

const getAllMusic = async (req: Request, res: Response) => {
    const decodedAuthToken = await verifyAuthToken(req.cookies.AUTH_TOKEN);

    if (!decodedAuthToken) {
        return res.status(401).send();
    }

    const userRepository = getRepository(User);
    const user = await userRepository
        .createQueryBuilder("user")
        .select(["user.id"])
        .where("user.id = :id", { id: decodedAuthToken.id })
        .leftJoinAndSelect("user.music", "music")
        .orderBy("music.timestamp", "DESC")
        .getOne();

    if (!user) {
        return res.status(404).send();
    }

    return res.json(user.music);
}

const getAllPlaylists = async (req: Request, res: Response) => {
    const decodedAuthToken = await verifyAuthToken(req.cookies.AUTH_TOKEN);

    if (!decodedAuthToken) {
        return res.status(401).send();
    }

    const userRepository = getRepository(User);
    const user = await userRepository
        .createQueryBuilder("user")
        .select(["user.id"])
        .where("user.id = :id", { id: decodedAuthToken.id })
        .leftJoinAndSelect("user.playlists", "playlists")
        .addOrderBy("playlists.timestamp", "DESC")
        .getOne();

    if (!user) {
        return res.status(404).send();
    }

    return res.json(user.playlists);
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

const getPlaylist = async (req: Request, res: Response) => {
    const decodedAuthToken = await verifyAuthToken(req.cookies.AUTH_TOKEN);

    if (!decodedAuthToken) {
        return res.status(401).send();
    }

    const playlistRepository = getRepository(Playlist);
    const playlist = await playlistRepository.findOne({
        where: {
            id: +req.params.id
        },
        relations: ["music"]
    });

    return res.status(200).json(playlist).end();
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

const createPlaylist = async (req: Request, res: Response) => {
    const decodedAuthToken = await verifyAuthToken(req.cookies.AUTH_TOKEN);

    if (!decodedAuthToken) {
        return res.status(401).send();
    }

    if (!req.body.name) {
        return res.status(400).send("Name is required");
    }

    const playlistRepository = getRepository(Playlist);
    const playlist = await playlistRepository.create({
        userId: decodedAuthToken.id,
        name: req.body.name,
        discription: req.body.discription,
        timestamp: `${Date.now()}`
    });
    await playlistRepository.save(playlist);

    return res.status(200).send();
}

const addMusicToPlaylist = async (req: Request, res: Response) => {
    const decodedAuthToken = await verifyAuthToken(req.cookies.AUTH_TOKEN);

    if (!decodedAuthToken) {
        return res.status(401).send();
    }

    const playlistRepository = getRepository(Playlist);
    const playlist = await playlistRepository.findOne({
        where: {
            id: +req.params.id
        },
        relations: ["music"]
    });

    if (!playlist) {
        return res.status(400).send();
    }

    const musicRepository = getRepository(Music);
    const music = await musicRepository.find({
        where: req.body.music
    });
    
    playlistRepository.merge(playlist, {
        music: [
            ...playlist.music,
            ...music
        ]
    });
    const result = await playlistRepository.save(playlist);

    return res.status(200).json(result.music).end();
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

    router.get('/all_music', getAllMusic);
    router.get('/all_playlists', getAllPlaylists);
    router.get('/get_one/:id', getTrack);
    router.get('/playlist/:id', getPlaylist);
    router.post('/', audioLoader.array("audio"), createMusic);
    router.post('/playlist', createPlaylist);
    router.put('/rename_track/:id', renameTrack);
    router.put('/add_music_to_playlist/:id', addMusicToPlaylist)
    router.delete('/:id', deleteMusic);

    return router;
}
