import express from 'express';
import { getDashboardStats, getAdminStats } from '../controllers/reportController.js';
import { protect, manager, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/dashboard', protect, manager, getDashboardStats);
router.get('/admin-stats', protect, admin, getAdminStats);

export default router;
