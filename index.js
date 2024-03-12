import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { database } from './db.js';
import userRoutes from './Routes/userRoutes.js';
import dealerRoutes from './Routes/dealerRoutes.js';
import commonRoutes from './Routes/commonRoutes.js';
import cookieParser from 'cookie-parser';

const PORT = process.env.PORT || 5000;

dotenv.config();

const app = express();

app.use(cookieParser());
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    return res.status(200).send("API is running");
});

app.use('/user', userRoutes);
app.use('/dealer', dealerRoutes);
app.use('/common', commonRoutes);

try {
    const db = await database;
    app.listen(PORT, () => {
        console.log(PORT);
    });
} catch (error) {
    console.log(error);
}