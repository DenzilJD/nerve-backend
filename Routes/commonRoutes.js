import express from 'express';
import { protectUser } from '../verifyToken.js';
import { allCars, carsByDealership } from '../Controllers/commonControls.js';

const router = express.Router();

router.route('/cars/all').get(protectUser, allCars);
router.route('/cars/dealer').get(protectUser, carsByDealership);

export default router;