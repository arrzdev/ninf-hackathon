import { connectToDatabase } from '@/services/db';

export default async function handler(req: any, res: any) {
    if (req.method !== 'POST') {
        // Return an error if the request method is not POST
        res.status(405).json({ error: 'Method Not Allowed' });
        return;
    }

    const { username } = req.body;

    try {
        const db = await connectToDatabase('users');
        const usersCollection = db.collection('users');

        // Check if the username exists in the database
        const existingUser = await usersCollection.findOne({ username });

        if (existingUser) {
            // User exists, perform login logic
            console.log('Login successful');
            res.status(200).json({ message: 'Login successful', username });
        } else {
            // User doesn't exist, create a new user
            await usersCollection.insertOne({ username });
            console.log('User created');
            res.status(200).json({ message: 'User created', username });
        }
    } catch (error) {
        console.error('An error occurred:', error);
        res.status(500).json({ error: 'An error occurred' });
    }
}
