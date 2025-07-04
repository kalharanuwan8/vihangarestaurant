import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Admin from "./pages/Admin";
import Cashier from "./pages/Cashier";
import Items from "./pages/Items";
import AdminTransactionBills from "./pages/AdminTransactionBills";
import Addmembers from "./pages/Addmembers";
import Settings from "./pages/Settings";
import BilledOrders from "./pages/BilledOrders";
import HeldOrders from "./pages/HeldOrders";
import Logs from "./pages/Logs";
import Adminmobile from "./pages/Adminmobile";
import Transaction from "./pages/Transaction";
import TransactionBills from "./pages/TransactionBills";
import PrintWindow from "./pages/PrintWindow"; // ✅ New page for thermal printing

function App() {
  const [role, setRole] = useState(null);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin" element={<Admin />} />

        {/* Cashier Panel Routes */}
        <Route path="/cashier/*" element={<Cashier />} />

        {/* Admin Panel Routes */}
        <Route path="/itemsmenu" element={<Items />} />
        <Route path="/addmembers" element={<Addmembers />} />
        <Route path="/transbills" element={<AdminTransactionBills />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/billed" element={<BilledOrders />} />
        <Route path="/held" element={<HeldOrders />} />
        <Route path="/transaction" element={<Transaction />} />
        <Route path="/transaction-bills" element={<TransactionBills />} />
        <Route path="/logs" element={<Logs />} />
        <Route path="/mobile" element={<Adminmobile />} />

        {/* ✅ Thermal print route (opens in new tab) */}
        <Route path="/print-window" element={<PrintWindow />} />
        <Route path="/reprint" element={<PrintWindow />} />

      </Routes>
    </Router>
  );
}

export default App;