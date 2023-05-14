import { connectToDatabase } from '@/services/db';
import { JwtToken } from '@/services/jwt';

export default async function handler(req: any, res: any) {
    if (req.method !== 'POST') {
        // Return an error if the request method is not POST
        res.status(405).json({ error: 'Method Not Allowed' });
        return;
    }

    const { name, date, location, capacity, hour, predictedCapacity } =
        req.body;

    try {
        if (!name || !date || !location || !capacity || !hour)
            throw new Error('Missing property');

        if (!req.headers.authorization) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const { id } = JwtToken.verify(req.headers.authorization);

        const db = await connectToDatabase('events');
        const eventsCollection = db.collection('events');

        const result = await eventsCollection.insertOne({
            name,
            date,
            location,
            maximum_capacity: capacity,
            current_capacity: 0,
            owner: id,
            hour,
            predicted_capacity: predictedCapacity,
        });

        res.status(200).json({
            message: 'Event created',
            id: result.insertedId,
        });
    } catch (error) {
        console.error('An error occurred:', error);
        res.status(500).json({ error: 'An error occurred' });
    }
}
