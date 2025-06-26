import Bill from '../model/Bill.js';
import Item from '../model/Item.js';

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

      // ✅ Only check stock and reduce if item has stock tracking (quantity !== null)
      if (item.quantity !== null) {
        if (item.quantity < billItem.quantity) {
          return res.status(400).json({
            message: `Not enough stock for "${item.itemName}". Only ${item.quantity} available.`
          });
        }

        // Reduce quantity
        item.quantity -= billItem.quantity;
        await item.save();
      }

      populatedBillItems.push({
        item: item._id,
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

export const getAllBills = async (req, res) => {
  try {
    const bills = await Bill.find()
      .populate('billItems.item', 'itemName') // Show item names
      .sort({ createdAt: -1 });
    res.status(200).json(bills);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bills', error: error.message });
  }
};

export const getBillById = async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id)
      .populate('billItems.item', 'itemName');
    if (!bill) {
      return res.status(404).json({ message: 'Bill not found' });
    }
    res.status(200).json(bill);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bill', error: error.message });
  }
};
