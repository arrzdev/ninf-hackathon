import { connectToDatabase } from '@/services/db';
import { Password } from '@/services/hash';
import { JwtToken } from '@/services/jwt';

export default async function handler(req: any, res: any) {
    if (req.method !== 'POST') {
        // Return an error if the request method is not POST
        res.status(405).json({ error: 'Method Not Allowed' });
        return;
    }

    const { username, password } = req.body;

    if (!username || !password) {
        throw new Error('Missing property');
    }

    try {
        const db = await connectToDatabase('users');
        const usersCollection = db.collection('users');

        // Check if the username exists in the database
        const existingUser = await usersCollection.findOne({ username });

        if (existingUser) {
            // User exists, perform login logic
            const match = Password.compare(existingUser.password, password);

            if (!match) throw new Error('Invalid password');

            // @ts-ignore
            const token = JwtToken.sign({ id: insertedId });

            res.status(200).json({ message: 'Login successfull', token });
        } else {
            const hashedPassword = await Password.toHash(password);

            // User doesn't exist, create a new user
            const { insertedId } = await usersCollection.insertOne({
                username,
                password: hashedPassword,
            });

            // @ts-ignore
            const token = JwtToken.sign({ id: insertedId });

            res.status(200).json({ message: 'User created', token });
        }
    } catch (error) {
        console.error('An error occurred:', error);
        res.status(500).json({ error: 'An error occurred' });
    }
}