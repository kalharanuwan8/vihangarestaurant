import mongoose from 'mongoose';
import Log from './Log.js';

const transBillSchema = new mongoose.Schema({
  billCode: { type: String, required: true, unique: true, trim: true },
  billItems: [
    {
      item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
      itemName: { type: String, required: true },
      category: { type: String, default: 'Unknown' },
      quantity: { type: Number, required: true, min: 1 },
      priceAtSale: { type: Number, required: true, min: 0 }
    }
  ],
  total: { type: Number, required: true, min: 0 },
  createdAt: { type: Date, default: Date.now }
});

// ✅ Trigger: log after save
transBillSchema.post('save', async function (doc) {
  if (doc.__userEmail) {
    await Log.create({
      actionType: 'Create Transaction Bill',
      description: `Created transaction bill (${doc.billCode}) with total Rs. ${doc.total}`,
      userEmail: doc.__userEmail
    });
  }
});

const TransBill = mongoose.model('TransBill', transBillSchema);
export default TransBill;
