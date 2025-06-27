import React, { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import SidebarCash from "../components/SidebarCash";
import ProductGrid from "../components/ProductGrid";
import BillingCart from "../components/BillingCart";
import PrintBillModal from "../components/PrintBillModal";
import HeldOrders from "./HeldOrders";
import BilledOrders from "./BilledOrders";
import Transaction from "./Transaction"; // ✅ NEW
import TransactionBills from "./TransactionBills"; // ✅ NEW
import axios from "../api/axios";

const Cashier = () => {
  const [cartItems, setCartItems] = useState([]);
  const [heldBills, setHeldBills] = useState([]);
  const [billedBills, setBilledBills] = useState([]);
  const [showBill, setShowBill] = useState(false);
  const [billType, setBillType] = useState(null);
  const navigate = useNavigate();

  const handleAddToCart = (product) => {
    setCartItems((prev) => {
      const exists = prev.find(
        (item) => item._id === product._id && item.name === product.name
      );
      return exists
        ? prev.map((i) =>
            i._id === product._id && i.name === product.name
              ? { ...i, qty: i.qty + 1 }
              : i
          )
        : [
            ...prev,
            {
              ...product,
              qty: 1,
              cartId: `${product._id}-${Date.now()}`,
            },
          ];
    });
  };

  const handleQtyChange = (cartId, value, isDirect = false) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.cartId === cartId
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

  const handleRemoveItem = (cartId) => {
    setCartItems((prev) => prev.filter((item) => item.cartId !== cartId));
  };

  const handleSubmitBill = async (type, action = "print") => {
    const payload = {
      billCode: `BILL-${Date.now()}`,
      billType: type,
      billItems: cartItems.map((item) => ({
        item: item._id,
        quantity: item.qty,
      })),
    };

    try {
      const res = await axios.post("/bills", payload);
      const savedBill = res.data.bill;

      const enrichedItems = savedBill.billItems.map((bItem) => {
        const match = cartItems.find((c) => c._id === bItem.item);
        return {
          name: match?.name || match?.itemName || "Unnamed Item",
          qty: bItem.quantity,
          price: match?.price || bItem.priceAtSale,
        };
      });

      setBilledBills((prev) => [
        ...prev,
        {
          ...savedBill,
          items: enrichedItems,
        },
      ]);

      setCartItems([]);
      setShowBill(false);
      setBillType(null);
    } catch (error) {
      console.error("❌ Error saving bill:", error.response?.data || error.message);
    }
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
    setBillType(null);
  };

  return (
    <div className="relative min-h-screen flex bg-gray-100">
      <SidebarCash
        isExpanded={true}
        heldBills={heldBills}
        onSelectHold={() => navigate("hold")}
      />

      <div className="flex-1 flex flex-col ml-24">
        <main className="flex-1 overflow-y-auto p-4">
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
                      onPrintBill={(type) => {
                        setBillType(type);
                        setShowBill(true);
                      }}
                      onHold={handleHold}
                      onSaveBill={(type) => handleSubmitBill(type, "save")}
                    />
                  </div>

                  {showBill && (
                    <PrintBillModal
                      items={cartItems}
                      total={cartItems.reduce((t, i) => t + i.price * i.qty, 0)}
                      billType={billType}
                      onClose={handleClosePrintModal}
                      onSave={() => handleSubmitBill(billType, "save")}
                      onPrint={() => handleSubmitBill(billType, "print")}
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

            {/* ✅ New Routes for Transactions */}
            <Route path="transaction" element={<Transaction />} />
            <Route path="transaction-bills" element={<TransactionBills />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default Cashier;
