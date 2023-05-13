import { MongoClient } from 'mongodb';

const uri =
    'mongodb+srv://adminu:Vxm8qqStPsoMzw0M@clusterzin.gmrrkoc.mongodb.net/?retryWrites=true&w=majority'; // Replace with your actual MongoDB connection URI
const client = new MongoClient(uri);

export async function connectToDatabase(db: string) {
    await client.connect();

    return client.db(db);
}
