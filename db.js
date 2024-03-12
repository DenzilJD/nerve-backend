import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGO_URI;

const db = MongoClient.connect(uri);
let client;

try {
    client=await db;
    console.log('Database connected');
} catch (error) {
    console.log(error);
}
export const database=client.db('nerve');