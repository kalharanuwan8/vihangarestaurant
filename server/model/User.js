import mongoose from 'mongoose';
import Log from './Log.js';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  isAdmin: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

// ✅ Log user creation
userSchema.post('save', async function (doc) {
  if (doc.__userEmail) {
    await Log.create({
      actionType: 'Create User',
      description: `Created new user account (${doc.email})`,
      userEmail: doc.__userEmail
    });
  }
});

const User = mongoose.model('User', userSchema);
export default User;
