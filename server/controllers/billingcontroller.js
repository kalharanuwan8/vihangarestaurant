import Bill from '../model/Bill.js';
import Item from '../model/Item.js';

// Create a new bill
export const createBill = async (req, res) => {
  try {
    const { billCode, billItems } = req.body;

    let total = 0;
    const populatedBillItems = [];

    for (const billItem of billItems) {
      const item = await Item.findById(billItem.item);
      if (!item) {
        return res.status(404).json({ message: `Item with ID ${billItem.item} not found.` });
      }

      // Calculate total and prepare bill item entry
      populatedBillItems.push({
        item: item._id.toString(), // store as string as per your schema
        quantity: billItem.quantity,
        priceAtSale: item.price
      });

      total += item.price * billItem.quantity;

      // Update item quantity
      item.quantity -= billItem.quantity;
      await item.save();
    }

    const newBill = new Bill({
      billCode,
      billItems: populatedBillItems,
      total
    });

    await newBill.save();
    res.status(201).json({ message: 'Bill created successfully', bill: newBill });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Bill code already exists.' });
    }
    res.status(500).json({ message: 'Error creating bill', error: error.message });
  }
};

// Get all bills
export const getAllBills = async (req, res) => {
  try {
    const bills = await Bill.find();
    res.status(200).json(bills);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bills', error: error.message });
  }
};

// Get bill by ID
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
