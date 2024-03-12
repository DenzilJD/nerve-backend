import jwt from 'jsonwebtoken';
import { database } from './db.js';

const users=database.collection('users');

export const protectUser = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
        try {
            jwt.verify(token, process.env.JWT_SECRET);
            next();
        } catch (error) {
            res.status(401).send('Invalid token');
        }
    }
    else
        res.status(401).send('No token');
}

// export const protectDealership = (req, res, next) = () => {
// }