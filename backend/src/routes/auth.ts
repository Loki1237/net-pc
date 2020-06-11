import express from 'express';
import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { User, Profile } from '../entity';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { verifyAuthToken } from '../middleware/verify-auth-token';
import DataValidation from '../middleware/sign-up-valid';

const signUp = async (req: Request, res: Response) => {
    const userData = req.body;

    if (
        !userData.firstName || !userData.lastName || !userData.gender || !userData.birthday ||
        !userData.country || !userData.city || !userData.email || !userData.password
    ) {
        return res.status(400).json({ error: "Please fill in all fields" });
    }


    const userRepository = getRepository(User);
    const profileRepository = getRepository(Profile);

    try {
        const validator = new DataValidation();
        await validator.validateAll(userData);

        const passwordHash = await bcrypt.hash(userData.password, 12);

        const newProfile = await profileRepository.create({
            gender: userData.gender,
            birthday: userData.birthday,
            country: userData.country,
            city: userData.city,
            familyStatus: "not_selected",
            activity: "",
            interests: "",
            hobby: "",
            aboutSelf: ""
        });
        await profileRepository.save(newProfile);

        const newUser = await userRepository.create({
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            password: passwordHash,
            avatar: "",
            online: false,
            createdAt: new Date(),
            profile: newProfile
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

    const userRepository = getRepository(User);
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send("Please enter your username and password");
    }

    const user = await userRepository.findOne({ email });
    
    try {
        if (!user) {
            throw new Error();
        } else {
            const validPassword = await bcrypt.compare(password, user.password);

            if (!validPassword) {
                throw new Error();
            }
        }

        const AUTH_TOKEN = await jwt.sign({ id: user.id, email: user.email }, process.env.JWT_PRIVATE_KEY);

        return res.status(200)
                  .cookie("AUTH_TOKEN", AUTH_TOKEN, { maxAge: 2592000000, httpOnly: true })
                  .json({ id: user.id })
                  .send();
    } catch {
        return res.status(401).send("Invalid login or password");
    }
}

const loginAs = async (req: Request, res: Response) => {
    if (!process.env.JWT_PRIVATE_KEY) {
        console.log('Error: not found JWT_PRIVATE_KEY');
        return res.status(500).send();
    }

    const userRepository = getRepository(User);
    const AUTH_TOKEN = req.cookies.AUTH_TOKEN;

    if (!AUTH_TOKEN) {
        return res.status(401).send();
    }

    const decodedAuthToken = await verifyAuthToken(AUTH_TOKEN);

    if (!decodedAuthToken) {
        return res.status(401).send();
    }

    const user = await userRepository.findOne({ id: decodedAuthToken.id });

    if (!user) {
        return res.status(401).send();
    }

    return res.status(200)
              .cookie("AUTH_TOKEN", AUTH_TOKEN, { maxAge: 2592000000, httpOnly: true })
              .json({ id: user.id })
              .send();
}

const logout = (req: Request, res: Response) => {
    return res.clearCookie('AUTH_TOKEN').send();
}

const changeEmail = async (req: Request, res: Response) => {
    if (!process.env.JWT_PRIVATE_KEY) {
        console.log('Error: not found JWT_PRIVATE_KEY');
        return res.status(500);
    }

    const decodedAuthToken = await verifyAuthToken(req.cookies.AUTH_TOKEN);

    if (!decodedAuthToken) {
        return res.status(401).send();
    }

    const userRepository = getRepository(User);
    const user = await userRepository.findOne({ id: decodedAuthToken.id });
    const newEmail = req.body.newEmail;

    if (!user) {
        return res.status(400).send();
    }

    try {
        const validator = new DataValidation();
        await validator.validateEmail(newEmail);

        userRepository.merge(user, { email: newEmail });
        await userRepository.save(user);

        const AUTH_TOKEN = await jwt.sign({ id: user.id, email: user.email }, process.env.JWT_PRIVATE_KEY);

        return res.status(200).cookie("AUTH_TOKEN", AUTH_TOKEN, { maxAge: 2592000, httpOnly: true }).send();
    } catch (err) {
        return res.status(400).json({ error:  err.message });
    }
}

const changePassword = async (req: Request, res: Response) => {
    const decodedAuthToken = await verifyAuthToken(req.cookies.AUTH_TOKEN);

    if (!decodedAuthToken) {
        return res.status(401).send();
    }

    const userRepository = getRepository(User);
    const user = await userRepository.findOne({ id: decodedAuthToken.id });
    const { oldPassword, newPassword } = req.body;

    if (!user) {
        return res.status(400).send();
    }

    try {
        const validPassword = await bcrypt.compare(oldPassword, user.password);

        if (!validPassword) {
            throw new Error("Invalid password");
        }

        const validator = new DataValidation();
        await validator.validatePassword(newPassword);

        const passwordHash = await bcrypt.hash(newPassword, 12);

        userRepository.merge(user, { password: passwordHash });
        await userRepository.save(user);

        return res.sendStatus(200).end();
    } catch (err) {
        return res.status(400).json({ error:  err.message });
    }    
}

export function authRouter() {
    const router = express.Router();

    router.post('/login', login);
    router.post('/login-as', loginAs);
    router.post('/sign-up', signUp);
    router.head('/logout', logout);
    router.put('/change_email', changeEmail);
    router.put('/change_password', changePassword);

    return router;
}
