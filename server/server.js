import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Environment Variables
const PORT = process.env.PORT || 5000;
const MONGO_URL = process.env.MONGO_URL;

// MongoDB Connection
mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✅ Connected to MongoDB');
})
.catch((err) => {
  console.error('❌ Failed to connect to MongoDB:', err);
});

// Basic route
app.get('/', (req, res) => {
  res.send('Server is running...');
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
