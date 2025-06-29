// cron/dailyResetJob.js
import cron from 'node-cron';
import Item from '../model/Item.js';
import generateItemPDF from '../utils/generateItemPDF.js';

cron.schedule('27 19 * * *', async () => {
  console.log('🕛 Daily reset job starting at 12PM.');

  try {
    const items = await Item.find({ category: { $nin:['Beverage','Cigarette'] } });
    await generateItemPDF(items);
    await Item.updateMany(
      { category: { $nin:['Beverage','Cigarette'] } },
      { $set:{ quantity:0, lastEditedField:'quantity', updatedAt:new Date() } }
    );
    console.log('✅ Quantities reset and PDF saved.');
  } catch (err) {
    console.error('❌ Reset job failed:', err.message);
  }
});
