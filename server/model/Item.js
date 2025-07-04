import mongoose from 'mongoose';
import Log from './Log.js';

const itemSchema = new mongoose.Schema({
  itemCode: { type: String, required: true, unique: true, trim: true },
  itemName: { type: String, required: true, trim: true },
  category: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  quantity: { type: Number, min: 0, default: null },
  imagePath: { type: String, trim: true, default: '' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Flag new documents
itemSchema.pre('save', function (next) {
  this._wasNew = this.isNew;
  this.updatedAt = Date.now();
  next();
});

// Log insert or update
itemSchema.post('save', async function (doc) {
  if (doc.__userEmail) {
    await Log.create({
      actionType: doc._wasNew ? 'Insert Item' : 'Update Item',
      description: `${doc._wasNew ? 'Inserted' : 'Updated'} item '${doc.itemName}' with price ${doc.price}`,
      userEmail: doc.__userEmail
    });
  }
});

// Log delete
itemSchema.post('findOneAndDelete', async function (doc) {
  if (doc && doc.__userEmail) {
    await Log.create({
      actionType: 'Delete Item',
      description: `Deleted item '${doc.itemName}' (code: ${doc.itemCode})`,
      userEmail: doc.__userEmail
    });
  }
});

const Item = mongoose.model('Item', itemSchema);
export default Item;
