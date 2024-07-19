import React from 'react';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import './MyAccount.css';

const isLoggedIn = () => {
  return localStorage.getItem('token') !== null;
};

const MyAccount = () => {
  const location = useLocation();
  if (!isLoggedIn()) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="my-account">
      <nav className="sidebar">
        <h2>My Account</h2>
        <ul>
          <li><Link to="/my-account" className={location.pathname === "/my-account" ? "active" : ""}>Your Account</Link></li>
          <li><Link to="/billing" className={location.pathname === "/billing" ? "active" : ""}>Billing Information</Link></li>
          <li><Link to="/invoices" className={location.pathname === "/invoices" ? "active" : ""}>Invoices</Link></li>
          <li><Link to="/my-plan" className={location.pathname === "/my-plan" ? "active" : ""}>Current Plan</Link></li>
          <li><Link to="/my-team" className={location.pathname === "/my-team" ? "active" : ""}>Team</Link></li>
        </ul>
      </nav>
      <div className="account-content">
        <Routes>
          <Route path="/my-account" element={<AccountOverview />} />
          <Route path="/billing" element={<Billing />} />
          <Route path="/invoices" element={<Invoices />} />
          <Route path="/my-plan" element={<MyPlan />} />
          <Route path="/my-team" element={<MyTeam />} />
          <Route path="*" element={<Navigate to="/my-account" />} />
        </Routes>
      </div>
    </div>
  );
};

const AccountOverview = () => <div>Account Overview Content</div>;
const Billing = () => <div>Billing Information Content</div>;
const Invoices = () => <div>Invoices Content</div>;
const MyPlan = () => <div>Current Plan Content</div>;
const MyTeam = () => <div>Team Content</div>;

export default MyAccount;
