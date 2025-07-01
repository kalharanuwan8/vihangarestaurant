import Bill from '../model/Bill.js';
import Item from '../model/Item.js';

// Create a new bill and save item snapshots
export const createBill = async (req, res) => {
  try {
    const { billCode, billItems, billType } = req.body;

    if (!billCode || !billItems || !billItems.length || !billType) {
      return res.status(400).json({ message: 'Invalid bill data' });
    }

    let total = 0;
    const populatedBillItems = [];

    for (const billItem of billItems) {
      const item = await Item.findById(billItem.item);
      if (!item) {
        return res.status(404).json({ message: `Item with ID ${billItem.item} not found.` });
      }

      // ✅ Allow stock to go negative
      if (item.quantity !== null && item.quantity !== undefined) {
        item.quantity = (item.quantity || 0) - billItem.quantity;
        await item.save();
      }

      // Save item snapshot for bill
      populatedBillItems.push({
        item: item._id,
        itemName: item.itemName,
        category: item.category || 'Unknown',
        quantity: billItem.quantity,
        priceAtSale: item.price
      });

      total += item.price * billItem.quantity;
    }

    const newBill = new Bill({
      billCode,
      billItems: populatedBillItems,
      total,
      billType
    });

    await newBill.save();

    res.status(201).json({
      message: '✅ Bill created successfully',
      bill: newBill
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Bill code already exists.' });
    }
    res.status(500).json({ message: 'Error creating bill', error: error.message });
  }
};

// Get all bills without populating removed items
export const getAllBills = async (req, res) => {
  try {
    const bills = await Bill.find().sort({ createdAt: -1 });
    res.status(200).json(bills);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bills', error: error.message });
  }
};

// Get a bill by ID
export const getBillById = async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id);
    if (!bill) {
      return res.status(404).json({ message: 'Bill not found' });
    }
    res.status(200).json(bill);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bill', error: error.message });
  }
};
