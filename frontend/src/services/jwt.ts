import jwt from 'jsonwebtoken';

interface ITokenPayload {
    id: string;
}

const JWT_SECRET = 'SECRET';

export class JwtToken {
    static sign(payload: ITokenPayload) {
        return jwt.sign(payload, JWT_SECRET, {
            expiresIn: '2d',
            algorithm: 'HS256',
        });
    }
    static verify(token: string) {
        const payload = jwt.verify(token, JWT_SECRET) as ITokenPayload;

        if (!payload || !payload.id) throw new Error('Invalid token payload');

        return payload;
    }
}
