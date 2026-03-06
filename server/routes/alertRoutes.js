import express from 'express';
import {
    createAlert,
    getAlertsByBuilding,
    resolveAlert,
    getAlertsByUser
} from '../controllers/alertController.js';
import { protect, manager } from '../middleware/authMiddleware.js';

const router = express.Router();

console.log('Alert Routes Loaded');

// Specific routes first
router.get('/user', protect, getAlertsByUser);
router.get('/building/:buildingId', protect, manager, getAlertsByBuilding);
router.put('/resolve/:id', protect, manager, resolveAlert);

// Root route last
router.post('/', protect, createAlert);

export default router;
