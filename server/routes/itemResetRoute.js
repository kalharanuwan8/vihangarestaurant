import express from 'express';
import Item from '../model/Item.js';
import generateItemPDF from '../utils/generateItemPDF.js';

const router = express.Router();

router.post('/reset-items', async (req, res) => {
  try {
    const items = await Item.find({ category: { $nin: ['Beverage', 'Cigarette'] } });

    const filePath = await generateItemPDF(items);

    await Item.updateMany(
      { category: { $nin: ['Beverage', 'Cigarette'] } },
      {
        $set: {
          quantity: 0,
          lastEditedField: 'quantity',
          updatedAt: new Date(),
        },
      }
    );

    res.status(200).json({ message: 'Quantities reset and PDF saved.', filePath });
  } catch (error) {
    console.error('Reset failed:', error.message);
    res.status(500).json({ error: 'Reset failed' });
  }
});

export default router;
