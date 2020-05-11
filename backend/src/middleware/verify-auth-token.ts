import jwt from 'jsonwebtoken';

export const verifyAuthToken = async (token: string) => {
    try {
        if (!process.env.JWT_PRIVATE_KEY) {
            throw new Error();
        }

        if (!token) {
            throw new Error();
        }
        
        interface DecodedToken { id: number, email: string, iat: string };

        if (!token) {
            throw new Error();
        }

        const decoded = await jwt.verify(token, process.env.JWT_PRIVATE_KEY) as DecodedToken;

        if (!decoded) {
            throw new Error();
        }

        return decoded;
    } catch {
        return null;
    }
}
