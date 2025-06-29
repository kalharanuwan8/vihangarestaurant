import Item from '../model/Item.js';

// CREATE
export const createItem = async (req, res) => {
  try {
    const newItem = new Item(req.body);
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
    const items = await Item.find();
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

// UPDATE with lastEditedField tracking
export const updateItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    const payload = req.body;
    let lastEditedField = null;

    // Compare fields to identify which changed
    for (const key of Object.keys(payload)) {
      if (payload[key] !== undefined && item[key] !== payload[key]) {
        lastEditedField = key;
        break; // only track first difference
      }
    }

    // Apply changes
    Object.assign(item, payload);
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
