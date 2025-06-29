import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/UserRoute.js'; // 🆕 Import user routes
import itemRoutes from './routes/ItemRoute.js'; // 🆕 Import item routes

import transbillRoutes from './routes/TransbillRoute.js';

import billRoutes from './routes/BillRoute.js'; // 🆕 Import bill routes
import authRoutes from './routes/AuthRoute.js'; // 🆕 Import auth routes
import syncRoutes from './routes/SyncRoute.js'; // 🆕 Import sync routes
import { testFirestoreConnection } from './testFirestoreConnection.js';

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
testFirestoreConnection(); // Test Firestore connection on server start
// 🆕 User API routes
app.use('/api/users', userRoutes);
app.use('/api/items', itemRoutes); // 🆕 Item API routes
app.use('/api/bills', billRoutes); // 🆕 Bill API routes

app.use('/api/transbills', transbillRoutes);

app.use('/api/auth', authRoutes); // 🆕 Auth API routes
app.use('/api', syncRoutes); // 🆕 Sync API routes



// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
