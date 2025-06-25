import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
        // You can add a regex pattern here for email validation if needed
    },
    password: {
        type: String,
        required: true
        // No hashing logic here — password will be stored as-is (not recommended for production)
    },
    role: {
        type: String,
        required: true,
        enum: ['Admin', 'Cashier'],
        default: 'Cashier'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const User = mongoose.model('User', userSchema);

export default User;
