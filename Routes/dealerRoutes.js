import express from 'express';
import { addCar, createDealer, getDeals, loginDealer, logoutDealer } from '../Controllers/dealerControls.js';
import { protectUser } from '../verifyToken.js';

const router = express.Router();

router.post('/create-user', createDealer);
router.get('/login', loginDealer);
router.route('/cars/add').post(protectUser, addCar);
router.route('/deals/all').get(protectUser, getDeals);
router.post('/logout', logoutDealer);

export default router;