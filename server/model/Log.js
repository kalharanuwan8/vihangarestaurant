// models/Log.js
import mongoose from 'mongoose';

const logSchema = new mongoose.Schema({
  actionType: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  userEmail: {
    type: String,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Log = mongoose.model('Log', logSchema);
export default Log;
