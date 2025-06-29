// routes/syncRoute.js

import express from 'express';
import { syncAllCollectionsToFirestore } from '../controllers/syncController.js'; // adjust the path if needed

const router = express.Router();

// Optional: use a secure token in .env for admin-only sync
const ADMIN_SYNC_TOKEN = process.env.SYNC_ADMIN_KEY;

router.get('/syncusers', async (req, res) => {
  try {
    const token = req.query.token;
    if (process.env.SYNC_ADMIN_KEY && token !== process.env.SYNC_ADMIN_KEY) {
      return res.status(403).json({ message: '❌ Unauthorized access' });
    }

    await syncAllCollectionsToFirestore(); // 🔄 new function
    res.status(200).json({ message: '✅ All collections synced to Firestore successfully.' });
  } catch (err) {
    console.error('❌ Error in /sync-users route:', err);
    res.status(500).json({ message: '❌ Sync failed', error: err.message });
  }
});

export default router;
