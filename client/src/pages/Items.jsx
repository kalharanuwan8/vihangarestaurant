import React, { useState, useEffect, useMemo } from 'react';
import {
  PlusIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import Sidebar from '../components/Sidebar';
import HorizontalNavbar from '../components/HorizontalNavbar';
// import axios from '../api/axios'; // removed API

function Items() {
  const [isSidebarExpanded, setSidebarExpanded] = useState(true);
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [newItem, setNewItem] = useState({
    itemCode: '',
    itemName: '',
    category: '',
    price: '',
    quantity: '',
    imagePath: ''
  });
  const [editingItemId, setEditingItemId] = useState(null);

  useEffect(() => {
    // Set dummy items instead of fetching from DB
    const dummyItems = [
      {
        _id: '1',
        itemCode: 'ITM001',
        itemName: 'Chicken Burger',
        category: 'Food',
        price: 350,
        quantity: 10,
        imagePath: '',
      },
      {
        _id: '2',
        itemCode: 'ITM002',
        itemName: 'Coca Cola',
        category: 'Beverages',
        price: 150,
        quantity: 25,
        imagePath: '',
      },
      {
        _id: '3',
        itemCode: 'ITM003',
        itemName: 'Cheese Pizza',
        category: 'Food',
        price: 800,
        quantity: 5,
        imagePath: '',
      }
    ];
    setItems(dummyItems);
  }, []);

  const toggleSidebar = () => setSidebarExpanded(!isSidebarExpanded);

  const filteredItems = useMemo(() => {
    return items
      .filter((item) => selectedCategory === 'All' || item.category === selectedCategory)
      .filter((item) => item.itemName.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [searchTerm, selectedCategory, items]);

  const categories = ['All', ...new Set(items.map((item) => item.category))];

  const openAddModal = () => {
    setNewItem({
      itemCode: '',
      itemName: '',
      category: '',
      price: '',
      quantity: '',
      imagePath: ''
    });
    setEditingItemId(null);
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setNewItem({ ...item });
    setEditingItemId(item._id);
    setShowModal(true);
  };

  const handleSaveItem = () => {
    const payload = {
      ...newItem,
      price: parseFloat(newItem.price),
      quantity: newItem.quantity ? parseInt(newItem.quantity) : undefined
    };

    if (editingItemId) {
      setItems((prev) =>
        prev.map((item) => (item._id === editingItemId ? { ...payload, _id: editingItemId } : item))
      );
    } else {
      setItems((prev) => [...prev, { ...payload, _id: Date.now().toString() }]);
    }

    setShowModal(false);
  };

  const handleDeleteItem = () => {
    setItems((prev) => prev.filter((item) => item._id !== editingItemId));
    setShowModal(false);
  };

  return (
    <div className="relative min-h-screen flex bg-gray-100">
      <Sidebar isExpanded={isSidebarExpanded} toggleSidebar={toggleSidebar} />
      <div className={`flex-1 flex flex-col ${isSidebarExpanded ? 'ml-52' : 'ml-20'}`}>
        <HorizontalNavbar />
        <main className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Manage Items</h1>
            <button onClick={openAddModal} className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded">
              <PlusIcon className="h-5 w-5 mr-1" /> Add New Item
            </button>
          </div>

          <div className="flex gap-4 mb-4">
            <input
              type="text"
              placeholder="Search..."
              className="flex-1 border px-4 py-2 rounded"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              className="border px-4 py-2 rounded"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((cat) => <option key={cat}>{cat}</option>)}
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow rounded">
              <thead className="bg-gray-200 text-gray-700">
                <tr>
                  <th className="py-2 px-4 text-left">Item Code</th>
                  <th className="py-2 px-4 text-left">Name</th>
                  <th className="py-2 px-4 text-left">Category</th>
                  <th className="py-2 px-4 text-left">Price</th>
                  <th className="py-2 px-4 text-left">Quantity</th>
                  <th className="py-2 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => (
                  <tr key={item._id} className="border-t">
                    <td className="py-2 px-4">{item.itemCode}</td>
                    <td className="py-2 px-4">{item.itemName}</td>
                    <td className="py-2 px-4">{item.category}</td>
                    <td className="py-2 px-4">Rs. {item.price}</td>
                    <td className="py-2 px-4">{item.quantity ?? '-'}</td>
                    <td className="py-2 px-4 text-right">
                      <button
                        onClick={() => openEditModal(item)}
                        className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded text-sm"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <div className="flex justify-between mb-4">
              <h2 className="text-xl font-bold">{editingItemId ? 'Edit Item' : 'Add Item'}</h2>
              <button onClick={() => setShowModal(false)}>
                <XMarkIcon className="w-6 h-6 text-gray-500 hover:text-red-600" />
              </button>
            </div>
            <div className="space-y-3">
              <input type="text" placeholder="Item Code" value={newItem.itemCode}
                onChange={(e) => setNewItem({ ...newItem, itemCode: e.target.value })}
                className="w-full border px-4 py-2 rounded" />
              <input type="text" placeholder="Item Name" value={newItem.itemName}
                onChange={(e) => setNewItem({ ...newItem, itemName: e.target.value })}
                className="w-full border px-4 py-2 rounded" />
              <input type="text" placeholder="Category" value={newItem.category}
                onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                className="w-full border px-4 py-2 rounded" />
              <input type="number" placeholder="Price" value={newItem.price}
                onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                className="w-full border px-4 py-2 rounded" />
              <input type="number" placeholder="Quantity (optional)" value={newItem.quantity}
                onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                className="w-full border px-4 py-2 rounded" />
              <input type="text" placeholder="Image URL (optional)" value={newItem.imagePath}
                onChange={(e) => setNewItem({ ...newItem, imagePath: e.target.value })}
                className="w-full border px-4 py-2 rounded" />
              <div className="flex justify-between">
                {editingItemId && (
                  <button onClick={handleDeleteItem} className="bg-red-500 text-white px-4 py-2 rounded">Delete</button>
                )}
                <button onClick={handleSaveItem} className="bg-indigo-600 text-white px-4 py-2 rounded w-full">
                  {editingItemId ? 'Update' : 'Add'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Items;
