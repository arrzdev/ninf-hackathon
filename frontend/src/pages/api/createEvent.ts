import { connectToDatabase } from '@/services/db';

export default async function handler(req: any, res: any) {
    if (req.method !== 'POST') {
        // Return an error if the request method is not POST
        res.status(405).json({ error: 'Method Not Allowed' });
        return;
    }

    const { name, date, location, capacity } = req.body;

    try {
        if (!name || !date || !location || !capacity)
            throw new Error('Missing property');

        const db = await connectToDatabase('events');
        const eventsCollection = db.collection('events');

        const result = await eventsCollection.insertOne({
            name,
            date,
            location,
            maximum_capacity: capacity,
            current_capacity: 0,
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
