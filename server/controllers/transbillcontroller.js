import TransBill from '../model/TransBill.js';
import Item from '../model/Item.js';

export const createTransBill = async (req, res) => {
  try {
    const { billCode, billItems } = req.body;

    if (!billCode || !billItems || !billItems.length) {
      return res.status(400).json({ message: 'Invalid transaction bill data' });
    }

    let total = 0;
    const snapshotItems = [];

    for (const billItem of billItems) {
      const item = await Item.findById(billItem.item);
      if (!item) {
        return res.status(404).json({ message: `Item not found: ${billItem.item}` });
      }

      if (item.quantity !== null && item.quantity !== undefined) {
        item.quantity = (item.quantity || 0) - billItem.quantity;
        item.__userEmail = req.user?.email || 'system'; // ✅ Logging for item update
        await item.save();
      }

      snapshotItems.push({
        item: item._id,
        itemName: item.itemName,
        category: item.category || 'Unknown',
        quantity: billItem.quantity,
        priceAtSale: item.price,
      });

      total += item.price * billItem.quantity;
    }

    const newBill = new TransBill({
      billCode,
      billItems: snapshotItems,
      total,
    });

    newBill.__userEmail = req.user?.email || 'system'; // ✅ For post-save logging
    await newBill.save();

    res.status(201).json({ message: '✅ Transaction bill created', bill: newBill });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Duplicate bill code' });
    }
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const getAllTransBills = async (req, res) => {
  try {
    const bills = await TransBill.find().sort({ createdAt: -1 });
    res.status(200).json(bills);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching bills', error: err.message });
  }
};

export const getTransBillById = async (req, res) => {
  try {
    const bill = await TransBill.findById(req.params.id);
    if (!bill) {
      return res.status(404).json({ message: 'Transaction bill not found' });
    }
    res.status(200).json(bill);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving bill', error: err.message });
  }
};
