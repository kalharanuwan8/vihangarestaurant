import express from 'express';
import {
  createTransBill,
  getAllTransBills,
  getTransBillById,
} from '../controllers/transbillcontroller.js';

const router = express.Router();

router.post('/', createTransBill);         // ➕ Create
router.get('/', getAllTransBills);         // 📄 Get All
router.get('/:id', getTransBillById);      // 🔍 Get by ID

export default router;
