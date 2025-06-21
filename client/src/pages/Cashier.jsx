import React, { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import SidebarCash from "../components/SidebarCash";
import ProductGrid from "../components/ProductGrid";
import BillingCart from "../components/BillingCart";
import PrintBillModal from "../components/PrintBillModal";
import HeldOrders from "./HeldOrders";
import BilledOrders from "./BilledOrders";

const Cashier = () => {
  const [cartItems, setCartItems] = useState([]);
  const [heldBills, setHeldBills] = useState([]);
  const [billedBills, setBilledBills] = useState([]);
  const [showBill, setShowBill] = useState(false);

  const navigate = useNavigate();

  const handleAddToCart = (product) => {
    setCartItems((prev) => {
      const exists = prev.find((item) => item.id === product.id);
      return exists
        ? prev.map((i) =>
            i.id === product.id ? { ...i, qty: i.qty + 1 } : i
          )
        : [...prev, { ...product, qty: 1 }];
    });
  };

  const handleQtyChange = (id, value, isDirect = false) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              qty: isDirect
                ? Math.max(0, value)
                : Math.max(0, item.qty + value),
            }
          : item
      )
    );
  };

  const handleRemoveItem = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handlePrint = () => {
    setShowBill(true);
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
    setCartItems([]);
  };

  const handleSelectHold = (id) => {
    const bill = heldBills.find((b) => b.id === id);
    if (bill) {
      setCartItems(bill.items);
      setHeldBills((prev) => prev.filter((b) => b.id !== id));
      navigate("/cashier");
    }
  };

  const handleClosePrintModal = () => {
    setShowBill(false);
    setCartItems([]);
  };

  return (
    <div className="relative min-h-screen flex bg-gray-100">
      <SidebarCash
        isExpanded={true}
        heldBills={heldBills}
        onSelectHold={() => navigate("hold")}
      />

      <div className="flex-1 flex flex-col ml-24 transition-all duration-300 ease-in-out">
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4">
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <div className="flex w-full gap-4">
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
                      total={cartItems.reduce(
                        (t, i) => t + i.price * i.qty,
                        0
                      )}
                      onClose={handleClosePrintModal}
                    />
                  )}
                </>
              }
            />

            <Route
              path="hold"
              element={
                <HeldOrders
                  heldBills={heldBills}
                  onSelectHold={handleSelectHold}
                />
              }
            />

            <Route
              path="billed"
              element={<BilledOrders billedBills={billedBills} />}
            />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default Cashier;
