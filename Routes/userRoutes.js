import express from 'express';
import { carsByDealership, createUser, loginUser, logoutUser, ownedCarsInfo } from '../Controllers/userControls.js';
import { protectUser } from '../verifyToken.js';

const router = express.Router();

router.post('/create-user', createUser);
router.get('/login', loginUser);
router.route('/cars/dealer').get(protectUser, carsByDealership);
router.route('/cars/owned').get(protectUser, ownedCarsInfo);
router.post('/logout', logoutUser);

export default router;