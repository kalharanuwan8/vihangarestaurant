import mongoose from 'mongoose';

const billSchema = new mongoose.Schema({
  billCode: {
    type: String,
    required: true,
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
  },
  billType: {
    type: String,
    enum: ['Restaurant', 'Delivery'],
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Bill = mongoose.model('Bill', billSchema);

export default Bill;
