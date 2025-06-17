import React, { useState, useMemo } from 'react';
import {
  MagnifyingGlassIcon,
  PlusIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import Sidebar from '../components/Sidebar';
import HorizontalNavbar from '../components/HorizontalNavbar';


const initialItems = [
  { id: 1, name: 'Espresso', category: 'Beverage', price: 150.0 },
  { id: 2, name: 'Latte', category: 'Beverage', price: 250.0 },
  { id: 3, name: 'Iced Americano', category: 'Beverage', price: 220.0 },
  { id: 4, name: 'Cheese Croissant', category: 'Bakery', price: 180.0 },
  { id: 5, name: 'Blueberry Muffin', category: 'Bakery', price: 160.0 },
  { id: 6, name: 'Chicken Sandwich', category: 'Food', price: 350.0 },
  { id: 7, name: 'Veggie Wrap', category: 'Food', price: 320.0 },
  { id: 8, name: 'Pasta Alfredo', category: 'Food', price: 450.0 },
  { id: 9, name: 'Mineral Water', category: 'Beverage', price: 50.0 },
  { id: 10, name: 'Cinnamon Roll', category: 'Bakery', price: 200.0 },
];

function Items() {
  const [isSidebarExpanded, setSidebarExpanded] = useState(true);
  const [items, setItems] = useState(initialItems);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', category: '', price: '' });
  const [editingItemId, setEditingItemId] = useState(null);

  const toggleSidebar = () => {
    setSidebarExpanded(!isSidebarExpanded);
  };

  const filteredItems = useMemo(() => {
    return items
      .filter(
        (item) => selectedCategory === 'All' || item.category === selectedCategory
      )
      .filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [searchTerm, selectedCategory, items]);

  const categories = ['All', ...new Set(items.map((item) => item.category))];

  const getCategoryBadgeClass = (category) => {
    switch (category) {
      case 'Beverage':
        return 'bg-blue-100 text-blue-800';
      case 'Bakery':
        return 'bg-yellow-100 text-yellow-800';
      case 'Food':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-200 text-gray-700';
    }
  };

  const openAddModal = () => {
    setNewItem({ name: '', category: '', price: '' });
    setEditingItemId(null);
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setNewItem({ name: item.name, category: item.category, price: item.price });
    setEditingItemId(item.id);
    setShowModal(true);
  };

  const handleSaveItem = () => {
    if (!newItem.name || !newItem.category || isNaN(newItem.price) || newItem.price <= 0) {
      alert('Please fill out all fields correctly.');
      return;
    }

    if (editingItemId) {
      // Update item
      const updatedItems = items.map((item) =>
        item.id === editingItemId
          ? { ...item, ...newItem, price: parseFloat(newItem.price) }
          : item
      );
      setItems(updatedItems);
    } else {
      // Add item
      const id = items.length ? items[items.length - 1].id + 1 : 1;
      const addedItem = { id, ...newItem, price: parseFloat(newItem.price) };
      setItems([...items, addedItem]);
    }

    setNewItem({ name: '', category: '', price: '' });
    setEditingItemId(null);
    setShowModal(false);
  };

  const handleDeleteItem = () => {
    if (editingItemId) {
      setItems(items.filter((item) => item.id !== editingItemId));
    }
    setNewItem({ name: '', category: '', price: '' });
    setEditingItemId(null);
    setShowModal(false);
  };

  return (
    <div className="relative min-h-screen flex bg-gray-100">
      <Sidebar isExpanded={isSidebarExpanded} toggleSidebar={toggleSidebar} />

      <div
        className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${
          isSidebarExpanded ? 'ml-52' : 'ml-20'
        }`}
      >
        <HorizontalNavbar />

        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-gray-800">Manage Items</h1>
              <button
                onClick={openAddModal}
                className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors"
              >
                <PlusIcon className="h-5 w-5" />
                <span>Add New Item</span>
              </button>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-lg shadow-md flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by item name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border rounded-lg px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Table */}
            <div className="shadow-lg rounded-lg overflow-hidden bg-white border border-gray-300">
              <div className="grid grid-cols-4 bg-blue-100 text-blue-800 font-semibold text-center">
                <div className="border border-gray-300 py-3">Item Name</div>
                <div className="border border-gray-300 py-3">Item Type</div>
                <div className="border border-gray-300 py-3">Item Price</div>
                <div className="border border-gray-300 py-3">Edit</div>
              </div>

              {filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <div key={item.id} className="grid grid-cols-4 text-center">
                    <div className="border border-gray-300 px-4 py-3 font-medium text-gray-800">
                      {item.name}
                    </div>
                    <div className="border border-gray-300 px-4 py-3">
                      <span
                        className={`text-sm font-medium px-3 py-1 rounded-full ${getCategoryBadgeClass(
                          item.category
                        )}`}
                      >
                        {item.category}
                      </span>
                    </div>
                    <div className="border border-gray-300 px-4 py-3 text-indigo-600 font-semibold font-mono">
                      Rs. {item.price.toFixed(2)}
                    </div>
                    <div className="border border-gray-300 px-4 py-3">
                      <button
                        onClick={() => openEditModal(item)}
                        className="text-indigo-600 font-semibold hover:underline"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-gray-500 border border-t-0 border-gray-300">
                  No items match your search.
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0  bg-opacity-30 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md backdrop-blur-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                {editingItemId ? 'Edit Item' : 'Add New Item'}
              </h2>
              <button onClick={() => setShowModal(false)}>
                <XMarkIcon className="w-6 h-6 text-gray-500 hover:text-red-600" />
              </button>
            </div>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Item Name"
                value={newItem.name}
                onChange={(e) =>
                  setNewItem({ ...newItem, name: e.target.value })
                }
                className="w-full border px-4 py-2 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              />
              <select
                value={newItem.category}
                onChange={(e) =>
                  setNewItem({ ...newItem, category: e.target.value })
                }
                className="w-full border px-4 py-2 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Select Category</option>
                <option value="Beverage">Beverage</option>
                <option value="Bakery">Bakery</option>
                <option value="Food">Food</option>
              </select>
              <input
                type="number"
                placeholder="Price (Rs.)"
                value={newItem.price}
                onChange={(e) =>
                  setNewItem({ ...newItem, price: e.target.value })
                }
                className="w-full border px-4 py-2 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              />

              <div className="flex justify-between space-x-2">
                {editingItemId && (
                  <button
                    onClick={handleDeleteItem}
                    className="w-1/2 bg-red-500 text-white py-2 rounded-lg font-semibold hover:bg-red-600"
                  >
                    Delete
                  </button>
                )}
                <button
                  onClick={handleSaveItem}
                  className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700"
                >
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
