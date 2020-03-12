import jwt, { decode } from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const saltRounds = 12;
const privateKey = "ld8ah3mn1xi4bq";

export default class UathService {
    public async login(email: string, password: string, repository: any): Promise<any> {
        const user = await repository.findOne({ 
            select: ["id", "name", "email", "password"],
            where: {
                email
            }
        });

        if (!user) {
            throw new Error();
        } else {
            const correctPassword = await bcrypt.compare(password, user.password);
            if (!correctPassword) {
                throw new Error();
            }
        }

        const JWT = await jwt.sign({ 
            id: user.id,
            email: user.email
        }, privateKey);

        delete user.password;

        return { user, JWT };
    }

    public async loginAs(token: string, repository: any): Promise<any> {
        interface DecodedToken {
            id: number,
            email: string,
            iat: string
        };
        const decoded = await jwt.verify(token, privateKey) as DecodedToken;
        const user = await repository.findOne({
            id: decoded.id, 
            email: decoded.email 
        });

        if (!user) {
            throw new Error();
        }

        const JWT = await jwt.sign({ 
            id: user.id,
            email: user.email
        }, privateKey);

        delete user.password;

        return { user, JWT };
    }
}
