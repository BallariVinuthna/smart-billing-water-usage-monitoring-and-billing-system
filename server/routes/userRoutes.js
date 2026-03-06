import express from 'express';
import { getUsers, deleteUser, updateUser, createUser } from '../controllers/userController.js';
import { protect, admin, manager } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .get(protect, admin, getUsers)
    .post(protect, admin, createUser);
router.route('/:id')
    .delete(protect, admin, deleteUser)
    .put(protect, manager, updateUser);

export default router;
