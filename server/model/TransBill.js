import mongoose from 'mongoose';

const transBillSchema = new mongoose.Schema({
  billCode: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  billItems: [
    {
      item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item',
        required: true,
      },
      itemName: {
        type: String,
        required: true,
      },
      category: {
        type: String,
        default: 'Unknown',
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
      priceAtSale: {
        type: Number,
        required: true,
        min: 0,
      },
    },
  ],
  total: {
    type: Number,
    required: true,
    min: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const TransBill = mongoose.model('TransBill', transBillSchema);
export default TransBill;
