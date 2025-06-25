import express from 'express';
import {
  createUser,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById
} from '../controllers/usercontroller.js';

const router = express.Router();

// Routes
router.post('/', createUser);           // Create a new user
router.get('/', getAllUsers);           // Get all users
router.get('/:id', getUserById);        // Get user by ID
router.put('/:id', updateUserById);     // Update user by ID
router.delete('/:id', deleteUserById);  // Delete user by ID

export default router;
