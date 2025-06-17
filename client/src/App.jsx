import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import ProductGrid from "./components/ProductGrid";
import BillingCart from "./components/BillingCart";
import PrintBillModal from "./components/PrintBillModal";
import HeldOrders from "./pages/HeldOrders";
import BilledOrders from "./pages/BilledOrders"; // ✅ New import

function App() {
  const [cartItems, setCartItems] = useState([]);
  const [heldBills, setHeldBills] = useState([]);
  const [billedBills, setBilledBills] = useState([]); // ✅ New state
  const [showBill, setShowBill] = useState(false);

  const navigate = useNavigate();

  const handleAddToCart = (product) => {
    setCartItems((prev) => {
      const exists = prev.find((item) => item.id === product.id);
      return exists
        ? prev.map((i) => (i.id === product.id ? { ...i, qty: i.qty + 1 } : i))
        : [...prev, { ...product, qty: 1 }];
    });
  };

  const handleQtyChange = (id, delta) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item
      )
    );
  };

  const handleRemoveItem = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handlePrint = () => {
    setShowBill(true); // Show modal

    // ✅ Save to billed orders
    const newBill = {
      id: Date.now(),
      items: [...cartItems],
      time: new Date().toLocaleTimeString(),
    };
    setBilledBills((prev) => [...prev, newBill]);
  };

  const handleHold = () => {
    const newHold = {
      id: Date.now(),
      items: [...cartItems],
      time: new Date().toLocaleTimeString(),
    };
    setHeldBills((prev) => [...prev, newHold]);
    setCartItems([]); // Clear cart after hold
  };

  const handleSelectHold = (id) => {
    const bill = heldBills.find((b) => b.id === id);
    if (bill) {
      setCartItems(bill.items);
      setHeldBills((prev) => prev.filter((b) => b.id !== id));
      navigate("/"); // Return to billing
    }
  };

  const handleClosePrintModal = () => {
    setShowBill(false);
    setCartItems([]); // Clear cart after printing
  };

  return (
    <div className="flex">
      <Sidebar heldBills={heldBills} onSelectHold={() => navigate("/hold")} />

      <Routes>
        <Route
          path="/"
          element={
            <>
              <div className="ml-20 sm:ml-24 md:ml-28 flex w-full">
                <div className="flex-grow bg-gray-50 min-h-screen">
                  <ProductGrid onAddToCart={handleAddToCart} />
                </div>
                <BillingCart
                  items={cartItems}
                  onQtyChange={handleQtyChange}
                  onRemove={handleRemoveItem}
                  onPrint={handlePrint}
                  onHold={handleHold}
                />
              </div>

              {showBill && (
                <PrintBillModal
                  items={cartItems}
                  total={cartItems.reduce((t, i) => t + i.price * i.qty, 0)}
                  onClose={handleClosePrintModal}
                />
              )}
            </>
          }
        />
        <Route
          path="/hold"
          element={<HeldOrders heldBills={heldBills} onSelectHold={handleSelectHold} />}
        />
        <Route
          path="/billed"
          element={<BilledOrders billedBills={billedBills} />}
        />
      </Routes>
    </div>
  );
}

export default function RootApp() {
  return (
    <Router>
      <App />
    </Router>
  );
}
