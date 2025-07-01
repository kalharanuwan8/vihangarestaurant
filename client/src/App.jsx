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
import Adminmobile from "./pages/Adminmobile"; // ✅ Ensure this is correctly added
import Transaction from "./pages/Transaction";
import TransactionBills from "./pages/TransactionBills";





function App() {
  const [role, setRole] = useState(null);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin" element={<Admin />} />

        {/* Nest all cashier-related routes inside Cashier */}
        <Route path="/cashier/*" element={<Cashier />} />
        <Route path="/itemsmenu" element={<Items />} />
        <Route path="/addmembers" element={<Addmembers />} />
        <Route path="/transbills" element={<AdminTransactionBills />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/billed" element={<BilledOrders />} />
        <Route path ="/held" element={<HeldOrders />} />
        <Route path="/transaction" element={<Transaction />} />
        <Route path="/transaction-bills" element={<TransactionBills />} />
        <Route path="/logs" element={<Logs />} />
        <Route path='/mobile' element={<Adminmobile />} />  
        <Route path="/settings" element={<Settings />} />
    
        
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;