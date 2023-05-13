import { connectToDatabase } from '@/services/db';
import { JwtToken } from '@/services/jwt';
import { ObjectId } from 'mongodb';

export default async function handler(req: any, res: any) {
    if (req.method !== 'POST') {
        // Return an error if the request method is not POST
        res.status(405).json({ error: 'Method Not Allowed' });
        return;
    }

    const { id } = req.body;

    if (!id) throw new Error('Missing property');

    if (!req.headers.authorization) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }

    try {
        JwtToken.verify(req.headers.authorization);

        const db = await connectToDatabase('events');
        const eventsCollection = db.collection('events');

        const event = await eventsCollection.findOneAndUpdate(
            { _id: new ObjectId(id) },
            { $inc: { current_capacity: 1 } }
        );

        if (!event) throw new Error('event not found');

        const d = event.value;

        // @ts-ignore
        d.current_capacity += 1;

        res.status(201).json({ data: d });
    } catch (error) {
        console.error('An error occurred:', error);
        res.status(500).json({ error: 'An error occurred' });
    }
}
