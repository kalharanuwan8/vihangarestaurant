import mongoose from 'mongoose';

const billSchema = new mongoose.Schema({
  billCode: {
    type: String,
    required: true, // Made optional for flexibility
    unique: true,
    trim: true
  },
  billItems: [
    {
      item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item',
        required: true
      },
      quantity: {
        type: Number,
        required: true,
        min: 1
      },
      priceAtSale: {
        type: Number,
        required: true,
        min: 0
      }
    }
  ],
  total: {
    type: Number,
    required: true,
    min: 0
  }
  // Removed cashier, date, time fields
});

const Bill = mongoose.model('Bill', billSchema);

export default Bill;
