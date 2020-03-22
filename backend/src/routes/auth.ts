import express from 'express';
import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Users } from '../entity/Users';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import DataValidation from '../middleware/sign-up-valid';

const signUp = async (req: Request, res: Response) => {
    const userRepository = getRepository(Users);
    const userData = req.body;

    if (
        !userData.firstName || !userData.lastName || !userData.gender || !userData.birthday ||
        !userData.country || !userData.city || !userData.email || !userData.password
    ) {
        return res.status(400).json({ error: "Please fill in all fields" });
    }

    try {
        const validator = new DataValidation();
        await validator.validate(userData);

        const passwordHash = await bcrypt.hash(userData.password, 12);
        const newUser = await userRepository.create({
            name: userData.firstName + " " + userData.lastName,
            email: userData.email,
            password: passwordHash,
            gender: userData.gender,
            birthday: userData.birthday,
            country: userData.country,
            city: userData.city,
            family_status: "not selected",
            avatar: "default.png",
            status: "offline"
        });
        await userRepository.save(newUser);

        return res.sendStatus(200).end();
    } catch (err) {
        return res.status(400).json({ error:  err.message });
    }
}

const login = async (req: Request, res: Response) => {
    if (!process.env.JWT_PRIVATE_KEY) {
        console.log('Error: not found JWT_PRIVATE_KEY');
        return res.status(500);
    }

    const userRepository = getRepository(Users);
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send("Please enter your username and password");
    }

    const user = await userRepository.findOne({ 
        select: ["email", "password"],
        where: { email }
    });
    
    try {
        if (!user) {
            throw new Error();
        } else {
            const correctPassword = await bcrypt.compare(password, user.password);

            if (!correctPassword) {
                throw new Error();
            }
        }

        const JWT = await jwt.sign({ email: user.email }, process.env.JWT_PRIVATE_KEY);

        return res.status(200).header('Set-cookie', `JWT=${JWT}; max-age=2592000; httpOnly`).send();
    } catch {
        return res.status(401).send("Incorrect login or password");
    }
}

const loginAs = async (req: Request, res: Response) => {
    if (!process.env.JWT_PRIVATE_KEY) {
        console.log('Error: not found JWT_PRIVATE_KEY');
        return res.status(500);
    }

    const userRepository = getRepository(Users);
    const JWT = req.cookies.JWT;
    interface DecodedToken { email: string, iat: string };

    if (!JWT) {
        return res.sendStatus(401);
    }

    try {
        const decoded = await jwt.verify(JWT, process.env.JWT_PRIVATE_KEY) as DecodedToken;
        const user = await userRepository.findOne({ email: decoded.email });

        if (user) {
            return res.status(200)
                      .header('Set-cookie', `JWT=${JWT}; max-age=2592000; httpOnly`)
                      .json({ id: user.id }).send();
        } else {
            return res.sendStatus(401);
        }
    } catch {
        return res.sendStatus(401);
    }
}

const logout = (req: Request, res: Response) => {
    return res.status(200).header('Set-cookie', `JWT=0; max-age=0`).send();
}

export function authRouter() {
    const router = express.Router();

    router.post('/login', login);
    router.post('/login-as', loginAs);
    router.post('/sign-up', signUp);
    router.head('/logout', logout);

    return router;
}
