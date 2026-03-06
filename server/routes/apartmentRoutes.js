import express from 'express';
import {
    createApartment,
    getApartments,
    getApartmentsByFloor,
    getApartmentsByUser,
    updateApartment,
    deleteApartment,
} from '../controllers/apartmentController.js';
import { protect, admin, manager } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, manager, createApartment);
router.get('/', protect, getApartments);

router.route('/:floorId')
    .get(protect, getApartmentsByFloor);

router.route('/user/:userId')
    .get(protect, getApartmentsByUser);

router.route('/:id')
    .put(protect, manager, updateApartment)
    .delete(protect, admin, deleteApartment);

export default router;
