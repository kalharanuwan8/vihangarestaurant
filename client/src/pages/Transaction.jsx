import React, { useState } from "react";
import SidebarCash from "../components/SidebarCash";
import ProductGrid from "../components/ProductGrid";
import TransactionBillCart from "../components/TransactionBillCart";
import axios from "../api/axios";

const Transaction = () => {
  const [cartItems, setCartItems] = useState([]);

  // ✅ Allow billing over stock (no limit)
  const handleAddToCart = (product) => {
    setCartItems((prev) => {
      const exists = prev.find((i) => i._id === product._id);
      if (exists) {
        return prev.map((i) =>
          i._id === product._id ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [
        ...prev,
        {
          ...product,
          qty: 1,
          cartId: `${product._id}-${Date.now()}`,
          quantity: product.quantity, // For display
        },
      ];
    });
  };

  // ✅ Qty can exceed stock, but never go below 0
  const handleQtyChange = (cartId, value, isDirect = false) => {
    setCartItems((prev) =>
      prev.map((i) => {
        if (i.cartId !== cartId) return i;
        const newQty = isDirect ? value : i.qty + value;
        const safeQty = Math.max(0, newQty);
        return { ...i, qty: safeQty };
      })
    );
  };

  const handleRemove = (cartId) => {
    setCartItems((prev) => prev.filter((i) => i.cartId !== cartId));
  };

  const handleTransactionSave = async () => {
  if (!cartItems.length) return;

  const payload = {
    billCode: `TXN-${Date.now()}`,
    billItems: cartItems.map(i => ({
      item: i._id,
      itemName: i.name || i.itemName,
      category: i.category || "Unknown",
      quantity: i.qty,
      priceAtSale: i.price,
    })),
    total: cartItems.reduce((sum, i) => sum + i.price * i.qty, 0),
  };

  try {
    await axios.post("/transbills", payload);
    setCartItems([]);
  } catch (err) {
    console.error("Transaction fail", err.response?.data || err.message);
  }
};


  return (
    <div className="relative min-h-screen flex bg-gray-100">
      <SidebarCash isExpanded />
      <div className="flex-grow ml-24 p-4 flex">
        <ProductGrid onAddToCart={handleAddToCart} />
        <TransactionBillCart
          items={cartItems}
          onQtyChange={handleQtyChange}
          onRemove={handleRemove}
          onSaveBill={handleTransactionSave}
        />
      </div>
    </div>
  );
};

export default Transaction;
