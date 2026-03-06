import express from 'express';
import {
    createBuilding,
    getBuildings,
    getBuildingById,
    updateBuilding,
    deleteBuilding,
} from '../controllers/buildingController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .post(protect, admin, createBuilding)
    .get(protect, getBuildings);

router.route('/:id')
    .get(protect, getBuildingById)
    .put(protect, admin, updateBuilding)
    .delete(protect, admin, deleteBuilding);

export default router;
