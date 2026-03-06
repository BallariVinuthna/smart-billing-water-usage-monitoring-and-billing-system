import express from 'express';
import {
    createFloor,
    getFloorsByBuilding,
    deleteFloor,
} from '../controllers/floorController.js';
import { protect, admin, manager } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .post(protect, manager, createFloor);

router.route('/:buildingId')
    .get(protect, getFloorsByBuilding);

router.route('/:id')
    .delete(protect, admin, deleteFloor);

export default router;
