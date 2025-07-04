import express from 'express';
import {
  createTransBill,
  getAllTransBills,
  getTransBillById,
} from '../controllers/transbillcontroller.js';

const router = express.Router();

// ✅ Middleware to extract email from header
router.use((req, res, next) => {
  const email = req.headers['x-user-email'];
  if (email) {
    req.user = { email };
  }
  next();
});

router.post('/', createTransBill);         // ➕ Create
router.get('/', getAllTransBills);         // 📄 Get All
router.get('/:id', getTransBillById);      // 🔍 Get by ID

export default router;
