import { connectToDatabase } from '@/services/db';

export default async function handler(req: any, res: any) {
    try {
        const db = await connectToDatabase('locations');
        const eventsCollection = db.collection('beachs');
        const data = await eventsCollection.find().toArray();

        const result = {};

        data.forEach(d => {
            // @ts-ignore
            result[d.location_id] = d.name;
        });

        res.status(200).json({ data: result });
    } catch (error) {
        console.error('An error occurred:', error);
        res.status(500).json({ error: 'An error occurred' });
    }
}
