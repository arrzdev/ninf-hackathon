import { MongoClient } from 'mongodb';

const mongoHost = process.env.MONGO_HOST;

if (!mongoHost){
  throw new Error('MONGO_HOST is not set');
}

const client = new MongoClient(mongoHost);
export async function connectToDatabase(db: string) {
    await client.connect();

    return client.db(db);
}
