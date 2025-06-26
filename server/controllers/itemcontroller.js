import Item from '../model/Item.js';

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

export const getAllItems = async (req, res) => {
  try {
    const items = await Item.find();
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching items', error: error.message });
  }
};

export const getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching item', error: error.message });
  }
};

export const updateItemById = async (req, res) => {
  try {
    const updatedItem = await Item.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedItem) return res.status(404).json({ message: 'Item not found' });
    res.status(200).json({ message: 'Item updated successfully', item: updatedItem });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Item code already exists.' });
    }
    res.status(500).json({ message: 'Error updating item', error: error.message });
  }
};

export const deleteItemById = async (req, res) => {
  try {
    const deletedItem = await Item.findByIdAndDelete(req.params.id);
    if (!deletedItem) return res.status(404).json({ message: 'Item not found' });
    res.status(200).json({ message: 'Item deleted successfully', item: deletedItem });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting item', error: error.message });
  }
};