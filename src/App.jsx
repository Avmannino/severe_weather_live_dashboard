import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Home from './components/Home.jsx';
import Dashboard from './components/Dashboard.jsx';
import Pricing from './components/Pricing.jsx';
import Navbar from './components/Navbar.jsx';
import Login from './components/Login.jsx';
import Signup from './components/Signup.jsx';
import MyAccount from './components/MyAccount.jsx';
import Loading from './components/Loading.jsx';
import Contact from './components/Contact.jsx';
import { AuthProvider, useAuth } from './components/AuthContext.jsx'; // Import AuthContext
import ProtectedRoute from './components/ProtectedRoute.jsx'; // Import ProtectedRoute

function App() {
    return (
        <AuthProvider>
            <Router>
                <MainApp />
            </Router>
        </AuthProvider>
    );
}

const MainApp = () => {
    const { isAuthenticated, login, logout } = useAuth(); // Use AuthContext
    const location = useLocation();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        const handleLoading = setTimeout(() => {
            setLoading(false);
        }, 700); // 0.7 seconds loading time

        return () => clearTimeout(handleLoading);
    }, [location.pathname]);

    return (
        <>
            {loading && <Loading />}
            {!loading && <Navbar isAuthenticated={isAuthenticated} onLogout={logout} />}
            {!loading && (
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/pricing" element={<Pricing />} />
                    <Route path="/login" element={<Login onLogin={login} />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/contact-us" element={<Contact />} />
                    {/* Protect the dashboard route */}
                    <Route path="/dashboard" element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    } />
                    <Route path="/my-account" element={
                        <ProtectedRoute>
                            <MyAccount />
                        </ProtectedRoute>
                    } />
                </Routes>
            )}
        </>
    );
}

export default App;
