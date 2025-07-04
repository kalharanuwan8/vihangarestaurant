import mongoose from 'mongoose';
import Log from './Log.js';

const billSchema = new mongoose.Schema({
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
  billType: { type: String, enum: ['Restaurant', 'Delivery'], required: true },
  createdAt: { type: Date, default: Date.now }
});

// Log bill creation
billSchema.post('save', async function (doc) {
  if (doc.__userEmail) {
    await Log.create({
      actionType: 'Create Bill',
      description: `Created ${doc.billType} bill (${doc.billCode}) with total Rs. ${doc.total}`,
      userEmail: doc.__userEmail
    });
  }
});

const Bill = mongoose.model('Bill', billSchema);
export default Bill;
