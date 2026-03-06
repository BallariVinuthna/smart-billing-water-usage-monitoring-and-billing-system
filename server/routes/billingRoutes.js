import express from 'express';
import {
    generateBill,
    generateAllBills,
    getApartmentBills,
    getPendingBills,
    payBill,
    createPaymentIntent
} from '../controllers/billingController.js';
import { protect, admin, manager } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/generate', protect, manager, generateBill);
router.post('/generate-all', protect, manager, generateAllBills);
router.get('/apartment/:apartmentId', protect, getApartmentBills);
router.get('/pending', protect, manager, getPendingBills);
router.post('/pay/:id', protect, payBill);
router.post('/create-payment-intent', protect, createPaymentIntent);

export default router;
