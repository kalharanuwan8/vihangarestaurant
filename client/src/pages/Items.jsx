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
    itemCode: '', itemName: '', category: '', price: '', imageFileName: '', newStock: ''
  });
  const [editingItemId, setEditingItemId] = useState(null);

  useEffect(() => {
    axios.get('/items')
      .then((res) => setItems(res.data))
      .catch((err) => console.error('Error fetching items', err));
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
    setNewItem({ itemCode: '', itemName: '', category: '', price: '', imageFileName: '', newStock: '' });
    setEditingItemId(null);
    setShowModal(true);
  };

  const openEditModal = (item) => {
    const fileName = item.imagePath ? item.imagePath.split("\\").pop().split("/").pop() : '';
    setNewItem({
      itemCode: item.itemCode,
      itemName: item.itemName,
      category: item.category,
      price: item.price,
      imageFileName: fileName,
      newStock: ''
    });
    setEditingItemId(item._id);
    setShowModal(true);
  };

  const handleSaveItem = async () => {
    const fixedImagePath = `C:/Users/ADMIN/Desktop/images/${newItem.imageFileName}`;

    const payload = {
      ...newItem,
      imagePath: fixedImagePath,
      price: parseFloat(newItem.price),
      newStock: newItem.newStock ? parseInt(newItem.newStock) : 0,
    };

    delete payload.imageFileName;

    try {
      if (editingItemId) {
        await axios.put(`/items/${editingItemId}`, payload);
      } else {
        await axios.post('/items', { ...payload, quantity: payload.newStock });
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

    autoTable(doc, {
      head: [['Code', 'Name', 'Category', 'Price', 'Qty', 'Edited Field', 'Edited At']],
      body: filteredItems.map(item => [
        item.itemCode,
        item.itemName,
        item.category,
        item.price.toFixed(2),
        item.quantity ?? '-',
        item.lastEditedField || '-',
        item.updatedAt ? new Date(item.updatedAt).toLocaleString() : '-'
      ]),
      startY: 30,
      styles: { fontSize: 8 },
    });

    doc.save(`item_status_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  return (
    <div className="relative min-h-screen flex bg-gray-100">
      <Sidebar isExpanded={isSidebarExpanded} toggleSidebar={toggleSidebar} />
      <div className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${isSidebarExpanded ? 'ml-52' : 'ml-20'}`}>
        <HorizontalNavbar />
        <main className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Manage Items</h1>
            <div className="flex gap-3">
              <button onClick={downloadPDF} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md shadow-sm">
                📄 Download PDF
              </button>
              <button onClick={openAddModal} className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md shadow-sm">
                <PlusIcon className="h-5 w-5 mr-1" /> Add Item
              </button>
            </div>
          </div>

          <div className="flex gap-4 mb-4">
            <input
              type="text"
              placeholder="Search by name..."
              className="flex-1 border border-gray-300 px-4 py-2 rounded-md shadow-sm"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            <select
              className="border border-gray-300 px-4 py-2 rounded-md shadow-sm"
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
            >
              {categories.map(cat => <option key={cat}>{cat}</option>)}
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
              <thead className="bg-gray-200 text-gray-700 text-sm">
                <tr>
                  <th className="py-3 px-4 text-left">Code</th>
                  <th className="py-3 px-4 text-left">Name</th>
                  <th className="py-3 px-4 text-left">Category</th>
                  <th className="py-3 px-4 text-left">Price</th>
                  <th className="py-3 px-4 text-left">Qty</th>
                  <th className="py-3 px-4 text-left">Edited Field</th>
                  <th className="py-3 px-4 text-left">Edited At</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-800">
                {filteredItems.map(item => (
                  <tr key={item._id} className="border-t hover:bg-gray-50 transition duration-200">
                    <td className="py-2 px-4">{item.itemCode}</td>
                    <td className="py-2 px-4">{item.itemName}</td>
                    <td className="py-2 px-4">{item.category}</td>
                    <td className="py-2 px-4">Rs. {item.price.toFixed(2)}</td>
                    <td className="py-2 px-4">{item.quantity ?? '-'}</td>
                    <td className="py-2 px-4">{item.lastEditedField || '-'}</td>
                    <td className="py-2 px-4">{item.updatedAt ? new Date(item.updatedAt).toLocaleString() : '-'}</td>
                    <td className="py-2 px-4 text-right">
                      <button
                        onClick={() => openEditModal(item)}
                        className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded text-xs"
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
    </div>
  );
}

export default Items;
