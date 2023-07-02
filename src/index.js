import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Register from "./components/register";
import Dashboard from "./components/dashboard";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/" element={<Register />} />
        {/* Other routes */}
      </Routes>
    </Router>
  </React.StrictMode>
);
