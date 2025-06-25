import express from 'express';
import {
  createItem,
  getAllItems,
  getItemById,
  updateItemById,
  deleteItemById
} from '../controllers/itemcontroller.js';

const router = express.Router();

// Routes
router.post('/', createItem);             // Create a new item
router.get('/', getAllItems);             // Get all items
router.get('/:id', getItemById);          // Get item by ID
router.put('/:id', updateItemById);       // Update item by ID
router.delete('/:id', deleteItemById);    // Delete item by ID

export default router;
