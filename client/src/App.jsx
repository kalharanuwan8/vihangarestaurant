import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Admin from "./pages/Admin";
import Cashier from "./pages/Cashier";
import Items from "./pages/Items";
import Addmembers from "./pages/Addmembers";
import Settings from "./pages/Settings";
import BilledOrders from "./pages/BilledOrders";
import HeldOrders from "./pages/HeldOrders";
import Logs from "./pages/Logs";
import Adminmobile from "./pages/Adminmobile"; // ✅ Ensure this is correctly added



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
        <Route path="/settings" element={<Settings />} />
        <Route path="/billed" element={<BilledOrders />} />
        <Route path ="/held" element={<HeldOrders />} />
        <Route path="/logs" element={<Logs />} />
        <Route path='/mobile' element={<Adminmobile />} />  
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Router>
  );
}

export default App;
