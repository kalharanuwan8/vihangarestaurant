import Item from '../model/Item.js';

// CREATE
export const createItem = async (req, res) => {
  try {
    const { newStock, ...rest } = req.body;

    const newItem = new Item({
      ...rest,
      quantity: newStock ?? 0, // use newStock to set quantity on creation
    });

    await newItem.save();
    res.status(201).json({ message: 'Item created successfully', item: newItem });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Item code already exists.' });
    }
    res.status(500).json({ message: 'Error creating item', error: error.message });
  }
};

// READ ALL
export const getAllItems = async (req, res) => {
  try {
    const items = await Item.find().sort({ updatedAt: -1 });
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching items', error: error.message });
  }
};

// READ ONE
export const getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching item', error: error.message });
  }
};

// UPDATE
export const updateItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    const { newStock, ...payload } = req.body;
    let lastEditedField = null;

    // Update fields and detect first change
    for (const key in payload) {
      if (payload[key] !== undefined && item[key] !== payload[key]) {
        item[key] = payload[key];
        if (!lastEditedField) lastEditedField = key;
      }
    }

    // Handle stock addition
    if (newStock && !isNaN(newStock)) {
      item.quantity = (item.quantity || 0) + parseInt(newStock);
      lastEditedField = 'quantity';
    }

    item.updatedAt = new Date();
    if (lastEditedField) {
      item.lastEditedField = lastEditedField;
    }

    await item.save();
    res.status(200).json({ message: 'Item updated successfully', item });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Item code already exists.' });
    }
    res.status(500).json({ message: 'Error updating item', error: error.message });
  }
};

// DELETE
export const deleteItemById = async (req, res) => {
  try {
    const deletedItem = await Item.findByIdAndDelete(req.params.id);
    if (!deletedItem) return res.status(404).json({ message: 'Item not found' });
    res.status(200).json({ message: 'Item deleted successfully', item: deletedItem });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting item', error: error.message });
  }
};
