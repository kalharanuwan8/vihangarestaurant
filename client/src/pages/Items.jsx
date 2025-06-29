import React, { useState, useEffect, useMemo } from 'react';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Sidebar from '../components/Sidebar';
import HorizontalNavbar from '../components/HorizontalNavbar';
import axios from '../api/axios';

function Items() {
  const [isSidebarExpanded, setSidebarExpanded] = useState(true);
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [newItem, setNewItem] = useState({
    itemCode: '', itemName: '', category: '', price: '', imagePath: '', newStock: ''
  });
  const [editingItemId, setEditingItemId] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchItems = async () => {
      try {
        const res = await axios.get('/items');
        if (isMounted) setItems(res.data);
      } catch (err) {
        if (isMounted) console.error('Error fetching items', err);
      }
    };

    fetchItems();
    return () => { isMounted = false; };
  }, []);

  const toggleSidebar = () => setSidebarExpanded(!isSidebarExpanded);

  const filteredItems = useMemo(() => {
    return items.filter(item =>
      (selectedCategory === 'All' || item.category === selectedCategory) &&
      item.itemName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [items, searchTerm, selectedCategory]);

  const categories = ['All', ...new Set(items.map(i => i.category))];

  const openAddModal = () => {
    setNewItem({ itemCode: '', itemName: '', category: '', price: '', imagePath: '', newStock: '' });
    setEditingItemId(null);
    setShowModal(true);
  };

  const openEditModal = item => {
    setNewItem({
      itemCode: item.itemCode,
      itemName: item.itemName,
      category: item.category,
      price: item.price,
      imagePath: item.imagePath || '',
      newStock: ''
    });
    setEditingItemId(item._id);
    setShowModal(true);
  };

  const handleSaveItem = async () => {
    const payload = {
      itemCode: newItem.itemCode,
      itemName: newItem.itemName,
      category: newItem.category,
      price: parseFloat(newItem.price),
      imagePath: newItem.imagePath,
      newStock: newItem.newStock ? parseInt(newItem.newStock) : 0,
    };

    try {
      if (editingItemId) {
        await axios.put(`/items/${editingItemId}`, payload);
      } else {
        await axios.post('/items', {
          ...payload,
          quantity: payload.newStock
        });
      }
      const res = await axios.get('/items');
      setItems(res.data);
      setShowModal(false);
    } catch (err) {
      console.error(err);
      alert('Failed to save item.');
    }
  };

  const handleDeleteItem = async () => {
    try {
      await axios.delete(`/items/${editingItemId}`);
      const res = await axios.get('/items');
      setItems(res.data);
      setShowModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Item Status Report', 14, 20);

    const head = [['Code', 'Name', 'Category', 'Price', 'Qty', 'Edited Field', 'Edited At']];
    const body = filteredItems.map(item => [
      item.itemCode,
      item.itemName,
      item.category,
      item.price.toFixed(2),
      item.quantity ?? '-',
      item.lastEditedField || '-',
      item.updatedAt ? new Date(item.updatedAt).toLocaleString() : '-'
    ]);

    autoTable(doc, {
      head,
      body,
      startY: 30,
      styles: { fontSize: 8 }
    });

    doc.save(`item_status_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  return (
    <div className="relative min-h-screen flex bg-gray-100">
      <Sidebar isExpanded={isSidebarExpanded} toggleSidebar={toggleSidebar} />
      <div className={`flex-1 flex flex-col ${isSidebarExpanded ? 'ml-52' : 'ml-20'}`}>
        <HorizontalNavbar />
        <main className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Manage Items</h1>
            <div className="flex gap-3">
              <button onClick={downloadPDF} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
                📄 Download Item Status PDF
              </button>
              <button onClick={openAddModal} className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded">
                <PlusIcon className="h-5 w-5 mr-1" /> Add New Item
              </button>
            </div>
          </div>

          <div className="flex gap-4 mb-4">
            <input
              type="text"
              placeholder="Search by name..."
              className="flex-1 border px-4 py-2 rounded"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            <select
              className="border px-4 py-2 rounded"
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
            >
              {categories.map(cat => <option key={cat}>{cat}</option>)}
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow rounded">
              <thead className="bg-gray-200 text-gray-700">
                <tr>
                  <th className="py-2 px-4">Code</th>
                  <th className="py-2 px-4">Name</th>
                  <th className="py-2 px-4">Category</th>
                  <th className="py-2 px-4">Price</th>
                  <th className="py-2 px-4">Qty</th>
                  <th className="py-2 px-4">Edited Field</th>
                  <th className="py-2 px-4">Edited At</th>
                  <th className="py-2 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map(item => (
                  <tr key={item._id} className="border-t hover:bg-gray-50">
                    <td className="py-2 px-4">{item.itemCode}</td>
                    <td className="py-2 px-4">{item.itemName}</td>
                    <td className="py-2 px-4">{item.category}</td>
                    <td className="py-2 px-4">{item.price.toFixed(2)}</td>
                    <td className="py-2 px-4">{item.quantity ?? '-'}</td>
                    <td className="py-2 px-4">{item.lastEditedField || '-'}</td>
                    <td className="py-2 px-4">{item.updatedAt ? new Date(item.updatedAt).toLocaleString() : '-'}</td>
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
              {['itemCode', 'itemName', 'category', 'price', 'imagePath'].map(key => (
                <input
                  key={key}
                  type={key === 'price' ? 'number' : 'text'}
                  placeholder={key.replace(/([A-Z])/g, ' $1')}
                  value={newItem[key] || ''}
                  onChange={e => setNewItem({ ...newItem, [key]: e.target.value })}
                  className="w-full border px-4 py-2 rounded"
                />
              ))}
              <input
                type="number"
                placeholder="Add New Stock"
                value={newItem.newStock}
                onChange={e => setNewItem({ ...newItem, newStock: e.target.value })}
                className="w-full border px-4 py-2 rounded"
              />
              <div className="flex justify-between">
                {editingItemId && (
                  <button onClick={handleDeleteItem} className="bg-red-500 text-white px-4 py-2 rounded">
                    Delete
                  </button>
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
