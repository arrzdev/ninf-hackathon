import { connectToDatabase } from '@/services/db';
import { JwtToken } from '@/services/jwt';

export default async function handler(req: any, res: any) {
    if (!req.headers.authorization) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }

    try {
        JwtToken.verify(req.headers.authorization);

        const db = await connectToDatabase('events');
        const eventsCollection = db.collection('events');

        const data = await eventsCollection.find().toArray();

        res.status(200).json({ data });
    } catch (error) {
        console.error('An error occurred:', error);
        res.status(500).json({ error: 'An error occurred' });
    }
}
