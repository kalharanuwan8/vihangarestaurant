import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
    itemCode: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    itemName: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    quantity: {
        type: Number,
        required: true,
        min: 0
    },
    imagePath: {
        type: String,
        trim: true,
        default: ''
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Automatically update `updatedAt` on save
itemSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

const Item = mongoose.model('Item', itemSchema);

export default Item;
