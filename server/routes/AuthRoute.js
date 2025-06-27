// backend/routes/authRoutes.js
import express from 'express';
import { loginUser, getAllUsers, deleteUser } from '../controllers/authController.js';

const router = express.Router();

router.post('/login', loginUser);
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);

export default router;
