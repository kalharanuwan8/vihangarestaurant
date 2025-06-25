import express from 'express';
import {
  createBill,
  getAllBills,
  getBillById
} from '../controllers/billingcontroller.js';

const router = express.Router();

// Routes
router.post('/', createBill);        // ➕ Create a new bill
router.get('/', getAllBills);        // 📄 Get all bills
router.get('/:id', getBillById);     // 🔍 Get bill by ID

export default router;
