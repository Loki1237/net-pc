import express from 'express';
import { Request, Response } from 'express';
import { getRepository, getConnection, Not } from 'typeorm';
import { Friend, User } from '../entity';
import { verifyAuthToken } from '../middleware/verify-auth-token';

const getFriends = async (req: Request, res: Response) => {
    const decodedAuthToken = await verifyAuthToken(req.cookies.AUTH_TOKEN);

    if (!decodedAuthToken) {
        return res.status(401).send();
    }

    const friendRepository = getRepository(Friend);
    const friendRequests = await friendRepository
        .createQueryBuilder("request")
        .select(["request.id", "request.timestamp"])
        .where("(request.user1Id = :userId OR request.user2Id = :userId)", { userId: decodedAuthToken.id })
        .andWhere("request.confirmed = true")
        .orderBy("request.timestamp", "DESC")
        .leftJoin("request.user1", "user1", "user1.id != :userId", { userId: decodedAuthToken.id })
        .addSelect(["user1.id", "user1.firstName", "user1.lastName", "user1.avatar", "user1.online"])
        .leftJoin("request.user2", "user2", "user2.id != :userId", { userId: decodedAuthToken.id })
        .addSelect(["user2.id", "user2.firstName", "user2.lastName", "user2.avatar", "user2.online"])
        .getMany();

    return res.json(friendRequests);
}

const getFriendRequests = async (req: Request, res: Response) => {
    const decodedAuthToken = await verifyAuthToken(req.cookies.AUTH_TOKEN);

    if (!decodedAuthToken) {
        return res.status(401).send();
    }

    const indexes = req.params.category === "out" ? [1, 2] : [2, 1];
    const friendRepository = getRepository(Friend);
    const friendRequests = await friendRepository
        .createQueryBuilder("request")
        .select(["request.id", "request.timestamp"])
        .where(`request.user${indexes[0]}Id = :userId`, { userId: decodedAuthToken.id })
        .andWhere("request.confirmed = false")
        .orderBy("request.timestamp", "DESC")
        .innerJoin(`request.user${indexes[1]}`, "user")
        .addSelect(["user.id", "user.firstName", "user.lastName", "user.avatar", "user.online"])
        .getMany();

    return res.json(friendRequests);
}

const createFrendRequest = async (req: Request, res: Response) => {
    const decodedAuthToken = await verifyAuthToken(req.cookies.AUTH_TOKEN);

    if (!decodedAuthToken) {
        return res.status(401).send();
    }

    const friendRepository = getRepository(Friend);
    const frendRequest = await friendRepository.create({
        user1Id: decodedAuthToken.id,
        user2Id: +req.params.id,
        confirmed: false,
        timestamp: `${Date.now()}`
    });
    await friendRepository.save(frendRequest);

    return res.status(200).send();
}

const confirmRequest = async (req: Request, res: Response) => {
    const decodedAuthToken = await verifyAuthToken(req.cookies.AUTH_TOKEN);

    if (!decodedAuthToken) {
        return res.status(401).send();
    }

    const friendRepository = getRepository(Friend);
    const request = await friendRepository.findOne({
        id: +req.params.id
    });

    if (!request || request.user1Id !== decodedAuthToken.id && request.user2Id !== decodedAuthToken.id) {
        return res.status(400).send();
    }
    
    friendRepository.merge(request, { confirmed: true });
    await friendRepository.save(request);

    return res.status(200).send();
}

const deleteRequest = async (req: Request, res: Response) => {
    const decodedAuthToken = await verifyAuthToken(req.cookies.AUTH_TOKEN);

    if (!decodedAuthToken) {
        return res.status(401).send();
    }

    const friendRepository = getRepository(Friend);
    const request = await friendRepository.findOne({
        id: +req.params.id
    });

    if (!request || request.user1Id !== decodedAuthToken.id && request.user2Id !== decodedAuthToken.id) {
        return res.status(400).send();
    }

    await friendRepository.delete({ id: +req.params.id });

    return res.status(200).send();
}

export function friendRouter() {
    const router = express.Router();

    router.get('/all', getFriends);
    router.get('/requests/:category', getFriendRequests);
    router.post('/:id', createFrendRequest);
    router.put('/:id', confirmRequest);
    router.delete('/:id', deleteRequest);

    return router;
}
