import express from 'express';
import {
  createBill,
  getAllBills,
  getBillById
} from '../controllers/billingcontroller.js';

const router = express.Router();

// Middleware to extract user email from headers
const attachUserEmail = (req, res, next) => {
  const email = req.headers['x-user-email'];
  if (email) {
    req.userEmail = email;
  }
  next();
};

router.use(attachUserEmail);

// Routes
router.post('/', createBill);      // Create a new bill
router.get('/', getAllBills);      // Get all bills
router.get('/:id', getBillById);   // Get bill by ID

export default router;
