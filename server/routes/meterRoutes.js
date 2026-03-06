import express from 'express';
import {
    addReading,
    getApartmentReadings,
    getReadingsByBuilding,
    simulateReadings,
} from '../controllers/meterController.js';
import { protect, admin, manager } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .post(protect, manager, addReading);

router.route('/simulate')
    .post(protect, admin, simulateReadings);

router.route('/apartment/:apartmentId')
    .get(protect, getApartmentReadings);

router.route('/building/:buildingId')
    .get(protect, manager, getReadingsByBuilding);

export default router;
